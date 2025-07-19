# Changes At Scale

1. Separate the web server from all non-web server related functionality.
2. Given the nature of the application, it will be significantly more read heavy than write. Most interactions will be through navigating to shorten links. As the app scales, this will be one of the first places to divide the traffic and scale, in terms of services. A read-only resolving service can scale for higher traffic demands, allowing the core creation API to use a smaller scale of instances.
3. Base62 was chosen because it can encode with all alphanumeric English characters without special characters. However, its computation is slightly more expensive than, say base64. If load on the creation of links becomes problematic, consider batch creation of IDs.
4. I would highly recommend breaking both the front-end and the backend into discrete projects (libraries).
