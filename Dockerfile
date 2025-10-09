FROM mcr.microsoft.com/playwright:v1.50.1

USER root

WORKDIR /app

COPY . .

RUN npm install

RUN npx playwright install --with-deps

EXPOSE 9323

RUN chmod +x run-tests.sh

CMD ["bash" , "run-tests.sh"]