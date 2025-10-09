#!/bin/bash

npx playwright test

npx playwright show-report --host 0.0.0.0 --port 9323 

# Keep the container running
tail -f /dev/null