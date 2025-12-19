import L from "leaflet";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconUrl: icon,
  shadowUrl: iconShadow,
});
// This file ensures that Leaflet's default icon URLs are correctly set up
// when using bundlers like Webpack or Vite, which may not handle static assets
// in the same way as traditional setups. By importing the icon images directly
// and setting them in the Leaflet Icon default options, we avoid issues where
// the default icons fail to load properly in the application.
