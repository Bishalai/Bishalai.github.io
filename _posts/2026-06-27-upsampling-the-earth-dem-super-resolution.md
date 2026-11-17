---
layout: post
title: "Upsampling the earth: DEM super-resolution over High Mountain Asia"
date: 2026-06-27
tags: [geospatial, super-resolution, remote-sensing]
description: Conditioning 30 m NASADEM upsampling to 10 m on co-registered Sentinel-2 imagery, benchmarked across 40 named sites in High Mountain Asia.
---

Digital elevation models are the quiet infrastructure of geoscience — flood models,
glacier tracking, route planning, hazard mapping — and they all care about resolution.
The open products are coarse: NASADEM ships at 30 m. The recent project takes a
3× super-resolution approach, conditioning elevation on the optical image that was
captured over the same ground.

## The setup

- **Input:** 30 m NASADEM elevation tiles.
- **Conditioning:** co-registered Sentinel-2 RGB imagery at 10 m.
- **Output:** 10 m elevation — a 3× upsample.
- **Evaluation:** over 40 named sites across High Mountain Asia (HMA).

The core intuition is simple: an RGB image already encodes the *shape* of the
terrain. Ridges, valleys, shadows, and snowlines are visible in the optical band, so
the model doesn't have to hallucinate structure — it has to read it off the
conditioning image and place it correctly in elevation.

## Why High Mountain Asia

HMA is a deliberately hard test. It contains some of the steepest, most
high-contrast relief on the planet, plus glaciers, debris cover, and deep valleys
where a 30 m cell straddles a thousand metres of altitude change. If the method only
works on gentle terrain, it will fail here — which is exactly the point of choosing
it.

## What I'd watch out for

- **Registration.** A half-pixel offset between the DEM and the Sentinel-2 tile
  teaches the model the wrong relationship. Most of the early errors were
  registration errors wearing a model costume.
- **Optical conditioning has limits.** Cloud cover, dense shadow, and snow can
  mislead the model. The conditioning image is a hint, not ground truth.
- **Metrics vs. terrain.** Averaged error over a tile hides catastrophic error on a
  ridge line. Per-site and per-slope-bin reporting told a much more honest story
  than a single number.

## Where it goes next

The natural follow-ups are a temporal dimension — repeat passes through the year to
track glacier surface change — and coupling the upsampler with downstream tasks so
the resolution gain is measured by what it *enables*, not only by RMSE.
