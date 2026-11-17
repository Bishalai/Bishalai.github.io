---
layout: post
title: "Notes on LoRA rank and alpha"
date: 2026-03-14
tags: [fine-tuning, lora, peft]
description: Working notes from systematic rank/alpha sweeps when fine-tuning LLMs and diffusion models with LoRA — where the parameters actually go.
---

Fine-tuning with LoRA is often sold as "the cheap option" — and it is, but only if you
pick `rank` and `alpha` deliberately. My recent sweeps have reinforced a few things
worth writing down.

## Where the parameters actually go

For a weight matrix of size *d × k*, full fine-tuning trains *d × k* parameters. LoRA
trains two low-rank matrices instead: *d × r* and *r × k*, with

```
ΔW = (alpha / r) · B · A
```

At `rank = 8` on a typical transformer layer, that is well under 1% of the original
budget — which is how I ended up with **over 90% fewer trainable parameters** across
a full model while holding task performance flat.

## What the sweeps showed

The pattern was consistent across both LLMs and Stable Diffusion checkpoints:

1. **Below rank 4**, quality degrades noticeably on tasks that need new vocabulary or
   new visual concepts — the adapter simply doesn't have the capacity.
2. **Between rank 8 and 32**, most of the available gain is captured. Beyond that,
   returns flatten while training cost keeps climbing.
3. **Alpha is the real dial.** Holding rank fixed and raising alpha behaves almost
   like raising rank, but with a different noise profile during training. The ratio
   `alpha / rank` matters more than either value alone.

A cheap sweep — four ranks, three alphas, one seed — is almost always worth it before
committing to a long run. The compute cost of the sweep is a rounding error next to
the run it saves.

## Practical notes

- Keep a fixed evaluation set *before* you start sweeping; otherwise you are tuning
  on vibes.
- Log the effective scaling (`alpha / rank`) next to the loss curve. It makes
  comparisons across runs actually readable months later.
- For diffusion models, evaluate image fidelity **and** prompt adherence. An adapter
  can win on one and quietly lose the other.

Next up: distilling these sweeps into a short write-up of the DEM super-resolution
work, where the same capacity-versus-cost question shows up in a very different
setting.
