FROM node:latest as build
COPY / /code/
WORKDIR /code/
RUN yarn install && yarn build

FROM nginx
COPY --from=build /code/dist/frontend/ /usr/share/nginx/html
COPY nginx.vh.default.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
