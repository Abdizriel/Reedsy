# Reedsy
> A simple job queue "fake" conversion file app with real-time notifications

## Requirements
* [Git](https://git-scm.com/)
* [NodeJS](https://nodejs.org) LTS
* [Ruby](https://www.ruby-lang.org/)
* SASS gem for Ruby `gem install sass`
* [Redis](https://redis.io/)

## How to install
1. Clone this repo `git clone git@github.com:Abdizriel/Reedsy.git`
2. Run `npm install`
3. Run `./node_modules/.bin/bower install`
4. Install Redis with default settings

## How to start
Make sure that you have set up those ENV variables:
* IP - IP Address where app needs to be started
* PORT - Port on which app needs to be started
* NODE_ENV - Type of run ENV
* REDIS_URI - Connection uri to Redis

Run `npm start`

## How to build
Run `npm build`
