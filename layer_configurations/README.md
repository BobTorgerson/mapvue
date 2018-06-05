# Layer configurations in GeoServer

This directory contains the SLDs and other configurations used for different maps.

## Adding a layer to GeoServer

### Getting the data added and layer published

 1. On the target server, locate the GeoServer data directory (perhaps `/usr/share/tomcat/webapps/geoserver/data/data/`).
 2. If you're adding layers for a new map, create a new subdirectory there (such as `wildfires`).
 3. Upload the data to that directory.
 4. Log into the GeoServer web interface.
 5. *If this is a new map* create a new Workspace for this map: (left side menu) Data > Workspaces > Add New Workspace.
 6. Add a Store for the layer: (left side menu) Data > Stores > Add New Store > (choose type of data).
   * Pick the correct Workspace for this layer!
   * Use the "Browse" button by "Connection Parameters" to load a file picker where you can navigate to the data to add.
   * The "Data Source Name" will be how we refer to the layer in MV, so choose something sane (and not generic!  Even though it's in a namespace, there are places where the layer name is resolved in the global namespace.)
7. On the next screen, choose "Publish."
8. You may need to click "Compute from..." under the "Bounding Boxes" sections.
9. Click "Save," and the layer is available.
10. (left side menu) Data > Layer Preview > (find your layer) > OpenLayers.  Check that the layer displays.
  * At this point, some fiddling may be needed with nodata values and other things so that the correct areas are transparent.  This will vary by layer.  Ask for help!

## Styling the layer

 1. (left side menu) Data > Styles > Add a new style.
 2. Provide name and *pick the workspace* for this new style.
 3. After making the SLD or other style, save.
 4. (left side menu) Data > Layers > (pick the layer you want to assign to the style) > *Publishing* tab > WMS Settings/Layer Settings > Default Style > (pick the default style).
 5. Save layer.
 6. (left side menu) Data > Layer Preview > (find your layer) > OpenLayers.  Check that the layer displays with the proper style.

## Configuring GeoWebCache for this layer

### Ensuring a proper Gridset is Present

For each different projection, we need a gridset to be present in order to enable cache for that layer.

 1. (left side menu) > Tile Caching > Gridsets > Create a new Gridset
 2. Name: pick the same name as the projection, here, `EPSG_3338`
 3. Coordinate Reference System > Find > (pick the right CRS)
 4. Gridset Bounds > Compute from maximum extent of CRS
 4. Tile Matrix Set > Define Grids based on > Resolution.
 5. Click "Add Zoom Level."
 6. Pixel Size = 4096.  *This matches the `resolutions` array in the CRS definition for Leaflet maps in our MapVue code!*
 7. Click "Add Zoom Level" and continue until you reach the end of what matches the CRS layer definition -- GeoServer automatically halves each step.
 8. Save.

### Add the gridset to a layer

 1. (left side menu) Data > Layers > (pick your layer) > *Tile Caching* tab
 2. Under "Available Gridsets" at bottom > Add grid subset > `EPSG_3338` > *click the green (+) symbol*
 3. Save.
 4. (left side menu) Tile Caching > Tile Layer > (pick your layer) > Seed/Truncate.  You'll be taken to the GeoWebCache page.
 5. Number of Tasks to Use = 4, Type of Operation = Seed - Generate Missing Tiles, Grid Set = `EPSG_3338`, Zoom Start = 0, Zoom Stop = where you stopped in zoom levels for the resolution array.
 6. Submit!  It'll churn away.

### Verifying Cache is in use for a layer

 1. Open a browser devtools session and go to the Network tab.
 2. Load the layer and watch for requests which are for that specific layer.
 3. Inspect a request, specifically the response headers.
 4. If you see `geowebcache` response headers and `cache HIT` then it's working.
