#!/bin/bash

npx playwright test

echo "LOCAL_RUN is set to: $LOCAL_RUN"

# Serve report only for local runs
if [ "$LOCAL_RUN" = "true" ]; then
  npx playwright show-report --host 0.0.0.0 --port 9323
  tail -f /dev/null
else
  echo "Skipping report server in CI. Container will stop running."
fi
