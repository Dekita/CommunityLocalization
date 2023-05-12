# CommunityLocalization
A simple script to generate a complete localization pak file for hogwarts legacy. 

## Why? 
Because only one mod can alter this resource, so it may as well be a community effort to define the data for it <3

# Adding Custom Entries: 
Add your data using json within the localization/custom folder. The filename chosen for your json file will be the name used for your localization key. You should commit your changes to this main project so that it can be repackaged and updated periodically. 

# To Rebuild
run `yarn` to install node modules (requires yarn package manager + node.js).
run `yarn run start` to re-generate the data table. 
add generated `output/zCommunityLocalizationMod.pak` to game (in correct path).

# When Committing Your Changes
Make sure you dont overwrite any existing custom entries!! Overriding default entries is fine ~ but your commit will only be accepted if the icon is an improvement to the original. Please try to include entries for all languages. Use google translate or something <3

# Should I include the binary files in my packaged mod?
No. As mentioned, only one single mod can alter this resource, so only one mod should be trying to. If needed, I can grant you access on nexus mod to upload a new version, just reach out: dekitrpg@gmail.com 

While still modding this game I'm happy to keep this mod up-to-date :)

See also: https://github.com/Dekita/CommunityIcons