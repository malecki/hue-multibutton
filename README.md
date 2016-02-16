## Why is this?

I have a [tap switch](http://www2.meethue.com/en-us/productdetail/philips-hue-tap-switch).
Using almost any of the Philips native apps, you can
program each button to do one thing. That’s stupid: _obviously every button
should move among several states in sequence_.

It turns out the Hue api provides a not-terrible way to do this, but
setting them up is pretty painful. You have to set `conditions` for several
`rules` and `actions` for each that set `sensor` states in addition to just
changing the lights.

### Hue API …peculiarities:

1. everything, including errors, returns `200`. (:fire:)
1. there’s a character length limit on the payload for rules, and it counts
spaces for no good reason — this makes editing a rule and `POST`ing it
utterly rage-inducing :japanese_goblin:
1. the Hue Beyond luminaires have 3 down lights, which can be addressed
individually as `light`s but behave as one in a `scene` so a rule has to set
state on all the lights; *no extant client can create a rule that does this.*
1. the way you do multi-state toggles is with a ‘generic sensor’ to which you
`PUT` some state and condition it on current sensor state. The interplay of
conditions and actions is easy enough to write down, but even easier to let
some web client manage for you.
1. ideally one would like to be able to set all the lights and say ‘make this
state 2 of button 2’; this is much harder than it deserves to be.
1. some things like the tap (ZGPSWITCH) emit relatively obscure events,
and remembering button events is tedious; including double conditions for them
(event `eq` event and `dx` the switch), doubly so.

  1. is `34`
  2. is `16`
  3. is `17`
  4. is `18`

### Ramblings

[Huejay](https://github.com/sqmk/huejay) is the only complete client library
I’ve seen. It’s current (1.11), and it uses modern javascript. Many (most? all?)
 others deal with outdated api, or only partially cover it; indeed most leave
 out *rules* and *sensors* entirely. However it is not browserify-friendly
 because it uses programmatic `require`s (rather unnecessarily). I have forked
 it so it works here but not yet put together a comprehensive PR back to the
 author.

 To date I have not worked with the `discover` parts of Huejay that use udp; browserify
 might be able to handle it with [browserify-dgram](https://github.com/alexstrat/dgram-browserify)
  but I don’t care at the moment. At present, if you want to program a tap
 switch yourself, getting a user hash for your bridge is not my concern, though
 I’d love to support it here. I am also wary of this option, as the
 [Hue labs](http://labs.meethue.com/) randomly wants me to re-auth some of
 the time and now I have like 5 huelabs users on my bridge.
 
## Try it yourself

```
npm install
gulp browsersync
```

All it does right now is log in to a bridge, if you give it an ip and a valid
‘username’ (a hash; hardly a name since it generates it and you can’t change
it). It stores these in localstorage so you don’t have to type them
in the future.
