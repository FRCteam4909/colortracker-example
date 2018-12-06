# colortracker.js

This is an example of using the computer vision algorithms and techniques that
are provided by [tracking.js](http://trackingjs.com) in the NodeJS
environment, rather than in its intended browser environment.

## Install

This code has been tested on Ubuntu 16.04, with NodeJS v8.x. It likely works
elsewhere and with other NodeJS versions, but you're in uncharted territory if
you go there.

* Install NodeJS
```bash
curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -
sudo apt-get install -y nodejs
```
* Clone this repository

* Install dependencies
```bash
cd colortracker-example
npm install
```

## Run

```bash
nodejs colortracker.js
```

The program looks for yellow objects, and prints the attributes of the
bounding rectangles it calculates for those objects.

For comparison and to help visualize what these bounding rectangles represent,
it would be useful to run the browser-based code as described at
[tracking.js](http://trackingjs.com).
