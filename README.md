# LeadLens

**Know Your Pipes. Protect Your Family.**

## The Problem

Lead poisoning kills millions of people around the world.

Low-income families are often at greater risk.

Many families don't know if the pipes bringing water into their homes contain lead.

## Our Solution

LeadLens is a free app that helps people find out if their water pipes might be made of lead.

All you need is your phone.

## How It Works

1. Take a picture of your water pipe.
2. Follow a few simple steps.
3. Find out what your pipe might be made of.

## Our Mission

Help every family protect their health, no matter how much money they make.

## Built At

CodeClash Hackathon — Towson University

## Pipe identification logic

The TypeScript rule-based classifier and unit tests are in `src/pipe-analysis`.
There is no React/Vite frontend in this checkout yet. Photos are accepted for
integration but are not analyzed; results use manually reported observations.
All results require confirmation and do not establish drinking-water safety.

```sh
npm ci
npm run typecheck
npm test
```

See [frontend integration and demo usage](docs/pipe-analysis.md).
