# Next.js + Tailwind CSS Example
# Mukhriddin-dev
This example shows how to use [Tailwind CSS](https://tailwindcss.com/) [(v2.2)](https://blog.tailwindcss.com/tailwindcss-2-2) with Next.js. It follows the steps outlined in the official [Tailwind docs](https://tailwindcss.com/docs/guides/nextjs).

It uses the new [`Just-in-Time Mode`](https://tailwindcss.com/docs/just-in-time-mode) for Tailwind CSS.

## Preview

Preview the example live on [StackBlitz](http://stackblitz.com/):

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/vercel/next.js/tree/canary/examples/with-tailwindcss)

## Deploy your own

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=next-example):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https://github.com/vercel/next.js/tree/canary/examples/with-tailwindcss&project-name=with-tailwindcss&repository-name=with-tailwindcss)

## How to use

Execute [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [npm](https://docs.npmjs.com/cli/init) or [Yarn](https://yarnpkg.com/lang/en/docs/cli/create/) to bootstrap the example:

```bash
npx create-next-app --example with-tailwindcss with-tailwindcss-app
# or
yarn create next-app --example with-tailwindcss with-tailwindcss-app
```

Deploy it to the cloud with [Vercel](https://vercel.com/new?utm_source=github&utm_medium=readme&utm_campaign=next-example) ([Documentation](https://nextjs.org/docs/deployment)).

## Examples

Redirect when user logs in
```
http://localhost:3000/en/auth?app_id=abc&app_secret=abc&redirect_url=http://www.google.com&app_name=myApp
```

Forgot Password
```
http://localhost:3000/en/forgotpassword?app_id=abc&app_secret=abc&redirect_url=http://www.google.com&app_name=myApp
```

Confirm Email (3rd party call not yet supported)
```
http://localhost:3000/auth/action/verifyemail?oobCode=m6INkV86ZU6ofEM9uVrUTQBVljh8AnLMah3_l_vhPHUAAAF6Yn5FUw&lang=en 

http://localhost:3000/auth/action/verifyemail?oobCode=m6INkV86ZU6ofEM9uVrUTQBVljh8AnLMah3_l_vhPHUAAAF6Yn5FUw&lang=en&app_id=digiapp&app_secret=12345&redirect_url=https://developer-playground.readme.io&app_name=app%20name

```

Reset Password
```
http://localhost:3000/auth/action/resetpassword?oobCode=2NH34FQZT3d-QCqO_9KXgtj1H8j9W2_YM3fhLZ2K6i0AAAF6WUUo5A&lang=en

http://localhost:3000/auth/action/resetpassword?oobCode=m6INkV86ZU6ofEM9uVrUTQBVljh8AnLMah3_l_vhPHUAAAF6Yn5FUw&lang=en&app_id=digiapp&app_secret=12345&redirect_url=https://developer-playground.readme.io&app_name=app%20name   
```

