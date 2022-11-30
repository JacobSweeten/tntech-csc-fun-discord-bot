FROM debian

RUN apt update && \
    apt install -y \
    curl

RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs

RUN mkdir /bot

COPY Source /bot

WORKDIR /bot

RUN npm install

ENTRYPOINT [ "node", "bot.js" ]