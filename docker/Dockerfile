# Start with an official Apache image
FROM httpd:latest

# Install git to clone the repository and update Apache configuration to serve from /var/www/html
RUN apt-get update && \
    apt-get install -y git && \
    rm -rf /var/lib/apt/lists/* && \
    mkdir -p /var/www/html && \
    sed -i 's|/usr/local/apache2/htdocs|/var/www/html|g' /usr/local/apache2/conf/httpd.conf

# Clone the GitHub repository into the new Apache document root
RUN git clone https://github.com/claesbert/PlexampStatusPage /var/www/html

# Expose port 80 to make the server accessible
EXPOSE 80

# Start the Apache server (CMD is inherited from httpd:latest)
