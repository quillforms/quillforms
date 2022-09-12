FROM wordpress:6.0

COPY ./custom-wp-ini.ini $PHP_INI_DIR/conf.d/
