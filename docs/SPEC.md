# SPEC

Natural language description of end result.

`sleepy-countdown`; an npm package consisting of a react component.

The component is a countdown timer that can be provided the following props:

1. `target`: a datetime type prop to dictate the countdown target.
2. `resolution`: the time resolution to display on the countdown timer, finer timescales are not shown, can be one of:
  - `day` (default)
  - `hour`
  - `minute`
  - `second`
3. `end_message`: the text to display when the countdown is over, which should replace the countdown timer (defaulted to "Countdown has ended.")
4. `title`: the title of the countdown timer
5. `description`: the description of the countdown timer, displayed in a muted text below the title
6. `type`: a pre-designed style, can be one of:
  - `modern`: a sleek, rounded design (default)
  - `classic`: an old-fashion looking timer that looks like a card flipping mechanism
  - `minimal`: minimalist style

## Visual Requirements:
- the `title` should be at the top, followed by `description` under it, and below that the actual live countdown timer
- the countdown timer should not change size when then timer ends
- the countdown timer, regardless of `resolution` or `type`, should always be the same size
