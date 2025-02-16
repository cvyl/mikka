---
title: 'A small project: Short.moe'
comment: false
date: 2024-06-09 23:28:32
cover: 'https://repository-images.githubusercontent.com/812269186/2a8e675e-0e9c-40e6-ad57-8cc9f82e4053'
tags: [privacy, programming]
category: Article
---

I've been recently working on a project with the domain [short.moe](https://short.moe) creating a serverless URL shortening service.

Short.moe is a free URL shortener service that allows you to easily shorten long URLs into shorter, more manageable links. Built with NextJS 14, Clerk, Prisma, and PostgreSQL, hosted on serverless on Vercel, Short.moe is designed to be both easy to use and user-friendly.

## Key Features

### Easy URL Shortening

With Short.moe, you can shorten URLs without the need to create an account. When shortening a URL without an account, the slug/alias (the unique part of the shortened URL) will be randomly generated using the nanoid package.

### Account-Based Customization

For users who create an account, Short.moe offers the ability to set custom slugs. This means you can create memorable, aliased links that are easy to share and recall. Clerk handles authentication, making the process of signing up and managing your account straightforward. On the technical side, this was very easy to do.

## In Short

Short.moe aims to be an easy option for anyone looking to shorten URLs quickly and easily, whether with or without a personalized alias/slug. Thank you for reading this short post.
