/* eslint-disable @typescript-eslint/no-unused-vars */
import {Pool} from 'pg';
import type {PoolConfig} from 'pg';
import fs from 'fs';
import path from 'path';
import {log} from '../log';

const {
  DATABASE_URL,
  MAX_DB_CONNECTIONS = '10',
  NODE_ENV = 'development',
} = process.env;

if(!DATABASE_URL) {
  throw new Error('No database was specified in DATABASE_URL.');
}

const parseDBUrl = () => {
  const url = new URL(DATABASE_URL);
  const {username, password, hostname, port, pathname} = url;
  const [, database] = pathname.split('/');
  return {username, password, hostname, port, database};
}

const generateDBConfig = () => {
  const {username, password, hostname, port, database} = parseDBUrl();
  let ssl = ['localhost', '127.0.0.1', 'database'].indexOf(hostname) < 0
    ? {rejectUnauthorized: false}
    : undefined;

  if(NODE_ENV === 'development') {
    ssl = {rejectUnauthorized: false};
  }
  const config = {
    user: username,
    password,
    host: hostname,
    port: parseInt(port),
    database,
    ssl,
    max: parseInt(MAX_DB_CONNECTIONS),
    allowExitOnIdle: true,
    idleTimeoutMillis: 30_000,
    keepAlive: true,
    keepAliveInitialDelayMillis: 10_000,
  };
  return config as PoolConfig;
}


const pool = new Pool(generateDBConfig());
pool.on('connect', async (_client) => {
  log('info', '[Pool] Client connected');
});
// if a client is idle in the pool
// and receives an error - for example when your PostgreSQL server restarts
// the pool will catch the error & let you handle it here
pool.on('error', (e, _client) => {
  log('error', '[Pool]', e.message, e.stack);
});

/**
 * @description Checks the `db_migrate` directory for new migrations and runs them. Compares against the `db_versions` table
 */
export async function upgrade() {
  log('warn', '[DB] Upgrading database...');
  let currentDbVersion: number;
  try {
    const {rows: [latest]} = await pool.query('SELECT MAX(db_version) AS version FROM db_versions;');
    ({version: currentDbVersion} = latest);
    if(currentDbVersion == null) {
      currentDbVersion = 0;
    }
  } catch(err) {
    // table doesn't exist, so it's at version 0
    currentDbVersion = 0;
  }

  const db_migrate_dir = path.join(process.cwd(), 'lib', 'db', 'db_migrate');
  const migrations_to_run = await fs.promises.readdir(db_migrate_dir);
  const versions = migrations_to_run.map(f => parseInt(f.split('.')[0]))
    .filter(v => !Number.isNaN(v));
  const maxVersion = Math.max(...versions);

  if(maxVersion > currentDbVersion) {
    // run migrations
    for(let i = currentDbVersion + 1; i <= maxVersion; i++) {
      const sql = await fs.promises.readFile(path.join(db_migrate_dir, `${i}.sql`), 'utf-8');
      await pool.query(sql);
      await pool.query('INSERT INTO db_versions (db_version) VALUES ($1)', [i]);
      log('info', `[DB] Migrated to version ${i}`);
    }
    log('info', `[DB] Database upgraded to version ${maxVersion}`);
  } else {
    log('info', `[DB] Database is already up to date (version ${currentDbVersion})`);
  }
}

const fileCache = new Map<string, [string, string[]]>();

/**
 * @description resolves the sql file from the `db` directory, replaces named parameters with positional parameters, runs the query, and returns the results
 * @param file_path the path to the sql file from the `db` directory
 * @param params arguments passed to the sql file
 * @returns 
 */
export async function file(file_path: string, params: Record<string, unknown> = {}) {
  let sql;
  let namedParams: string[] = [];
  try {
    if(fileCache.has(file_path)) {
      [sql, namedParams] = fileCache.get(file_path)!;
    } else {
      const resolvedPath = path.join(process.cwd(), 'lib', file_path);
      sql = fs.readFileSync(resolvedPath, 'utf-8').toString();
      fileCache.set(file_path, [sql, namedParams]);
    }
  } catch (error) {
    log('error', '[DB]', error);
    throw error;
  }
  
  sql = `-- ${file_path}\n${sql}`;
  const namedParam = (m: string) => {
    const p = m.slice(2, -1);
    const i = namedParams.indexOf(p);
    if(i >= 0) {
      return `$${i + 1}`;
    }
    namedParams.push(p);
    return `$${namedParams.length}`;
  };
  sql = sql.replace(/\$\{[^{}]+\}/g, namedParam);

  log('debug', '[DB]', sql);

  const queryPromise = pool.query({text: sql, values: namedParams.map(p => params[p])});

  return queryPromise.catch((e) => {
    const line = (sql.substring(0, e.position).match(/\n/g) || []).length;
    const msg = `SQL error: ${file_path} (line: ${line}):\n\t${e}.`;
    e.cause = {
      path: file_path,
      params,
      line,
      code: e.code,
    };
    log('error', msg);
    throw e;
  })
}
