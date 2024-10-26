# Utiliser l'image de base php:5.6-apache
FROM php:5.6-apache

ENV TIMEZONE Europe/Paris

# Installer l'extension mysqli
RUN docker-php-ext-install mysqli pdo pdo_mysql

# ~~~~~~ TIMEZONE ~~~~~~

RUN ln -snf /usr/share/zoneinfo/${TIMEZONE} /etc/localtime && \
echo ${TIMEZONE} > /etc/timezone && \
date


RUN echo "display_errors = On\n\
date.timezone = Europe/Paris" > /usr/local/etc/php/php.ini