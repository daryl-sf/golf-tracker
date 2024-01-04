@app
golf-tracker-adca

@aws
runtime nodejs18.x
# concurrency 1
# memory 1152
# profile default
region eu-west-1
timeout 30

@http
/*
  method any
  src server

@plugins
plugin-remix
  src plugin-remix.js

@static
fingerprint true

@tables
user
  pk *String

password
  pk *String # userId

note
  pk *String  # userId
  sk **String # noteId

shot
  pk *String  # userId
  sk **String # shotId

@tables-indexes
shot
  pk *String # userId
  sk **String # roundId
  name byRound
