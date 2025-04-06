#!/bin/bash

TOKEN="ijjFPzTJdJHwpM5gHa6mpEJD94e0z3suy1iTFgWyBA3m8HWuCdhKrSxTVhuZ2TcrwPgrEomxqmLKHoeYylBKi7PimayQa5tMQ3cU"
AUTH_HEADER="Authorization:$TOKEN"

SERVER_URL="http://127.0.0.1:5000"
API_COMMAND=$1
ITEM_TO_QUERY=$2

ITEM_TO_QUERY=${ITEM_TO_QUERY// /%20}

if [[ "$API_COMMAND" == *"graph"* ]]; then
  IMAGEFILE="/tmp/image-$RANDOM.png"
  GRAPHIC_COMMAND="--output $IMAGEFILE"
fi

curl --header $AUTH_HEADER $SERVER_URL/$API_COMMAND/$ITEM_TO_QUERY $GRAPHIC_COMMAND

if [ "$GRAPHIC_COMMAND" != "" ]; then
  open "$IMAGEFILE"
fi
