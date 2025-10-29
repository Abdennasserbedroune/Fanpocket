# Team Flags Directory

This directory should contain flag SVG files for all 24 AFCON 2025 teams.

## Required Files

The following flag files are needed (lowercase country codes):

- `mar.svg` - Morocco
- `sen.svg` - Senegal
- `egy.svg` - Egypt
- `nga.svg` - Nigeria
- `cmr.svg` - Cameroon
- `dza.svg` - Algeria
- `tun.svg` - Tunisia
- `civ.svg` - Ivory Coast
- `gha.svg` - Ghana
- `mli.svg` - Mali
- `bfa.svg` - Burkina Faso
- `zaf.svg` - South Africa
- `cod.svg` - DR Congo
- `gin.svg` - Guinea
- `gab.svg` - Gabon
- `uga.svg` - Uganda
- `cpv.svg` - Cape Verde
- `mrt.svg` - Mauritania
- `ago.svg` - Angola
- `zmb.svg` - Zambia
- `tza.svg` - Tanzania
- `moz.svg` - Mozambique
- `nam.svg` - Namibia
- `bwa.svg` - Botswana

## Format

- **Format**: SVG
- **Dimensions**: 4:3 ratio (e.g., 400x300px)
- **Naming**: Lowercase ISO 3166-1 alpha-3 country code
- **Source**: Use flag-icons or similar open-source flag collections

## Usage

The onboarding system currently uses emoji flags (🇲🇦) as a fallback. Replace these with SVG files for better cross-platform support.

To use SVG flags, update the `getCountryFlag` function in `/src/js/pages/onboarding.js` to return:

```javascript
<img src="/images/flags/${code.toLowerCase()}.svg" alt="${teamName} flag" />
```
