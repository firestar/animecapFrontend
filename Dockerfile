FROM nginx
COPY static/ /usr/share/nginx/html
COPY nginx.vh.default.conf /etc/nginx/conf.d/default.conf
EXPOSE 80