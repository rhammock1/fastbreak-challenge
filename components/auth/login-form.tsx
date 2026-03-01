'use client';

import {useForm} from 'react-hook-form';
import {toast} from 'sonner';
import {login} from '@/lib/actions/auth';
import {AuthFormValues, authResolver} from '@/lib/validations/auth';

import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from '@/components/ui/form';

export function LoginForm() {
  const form = useForm<AuthFormValues>({
    resolver: authResolver,
    defaultValues: {email: '', password: ''},
  });

  async function onSubmit(values: AuthFormValues) {
    const result = await login(values)
    if(!result.success) {
      toast.error(result.error);
    }
    // login redirects on success
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({field}) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input 
                  type="email"
                  placeholder="johndoe@example.com"
                  {...field} />
              </FormControl>
              <FormMessage/>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({field}) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input 
                  type="password"
                  placeholder="Password"
                  {...field} />
              </FormControl>
              <FormMessage/>
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? 'Signing in...' : 'Sign in'}
        </Button>
      </form>
    </Form>
  )
}