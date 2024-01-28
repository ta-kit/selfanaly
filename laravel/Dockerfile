FROM php:8.2-fpm

RUN apt-get update && apt-get install -y libpng-dev libjpeg-dev libfreetype6-dev zip unzip git

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

ENV COMPOSER_ALLOW_SUPERUSER=1

WORKDIR /var/www

COPY . /var/www

RUN composer clear-cache && composer install --no-interaction --prefer-dist --optimize-autoloader -vvv

EXPOSE 9000

CMD ["php-fpm"]
