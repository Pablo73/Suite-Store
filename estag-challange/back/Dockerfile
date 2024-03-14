FROM php:8.1.0-apache

COPY --from=composer/composer:latest-bin /composer /usr/bin/composer

RUN apt-get update && \
    apt-get install -y libpq-dev zip unzip && \
    pecl install pcov && \
    docker-php-ext-configure pgsql -with-pgsql=/usr/local/pgsql && \
    docker-php-ext-install pdo pdo_pgsql pgsql && \
    docker-php-ext-enable pcov

RUN a2enmod rewrite
RUN a2enmod headers

RUN echo 'PassEnv Authorization' > /etc/apache2/conf-enabled/passenv.conf

COPY virtualhost.conf /etc/apache2/sites-enabled/000-default.conf

COPY composer.json /var/www/html/composer.json

COPY composer.lock /var/www/html/composer.lock

RUN composer install --no-scripts --no-autoloader

RUN composer dump-autoload --optimize

COPY . /var/www/html
