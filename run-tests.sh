#!/bin/bash

npx playwright test

npx playwright show-report --host 0.0.0.0 --port 9323 

# Keep container alive only if LOCAL_RUN is set
if [ "$LOCAL_RUN" = "true" ]; then
  tail -f /dev/null
fi