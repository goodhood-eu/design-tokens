const fs = require("fs");
const path = require("path");

const CONTENTS = {
    info: {
        author: "xcode",
        version: 1,
    },
};

const createDir = (path) => {
    try {
        fs.mkdirSync(path, {
            recursive: true
        });
    } catch (err) {
        if (err.code !== "EEXIST") throw err;
    }
};

module.exports = {
    do: (dictionary, {
        buildPath
    }) => {
        const assetPath = path.join(buildPath, "DesignTokens.xcassets");

        createDir(assetPath);
        fs.writeFileSync(`${assetPath}/Contents.json`, JSON.stringify(CONTENTS));

        const colorTokens = dictionary.allProperties
            .filter((token) => {
                return token.attributes.category === `color`;
            })

        colorTokens.forEach(({
            name,
            attributes: {
                rgb
            }
        }) => {
            /*
             // disabled for now, as no dark color variants are supplied
            if (name.includes("ColorDark")) {
                return;
            };
             */
            const colorName = name.replace("color_default_", "");
            const colorsetPath = `${assetPath}/${colorName}.colorset`;
            createDir(colorsetPath);

            /*
             // disabled for now, as no dark color variants are supplied
            var darkVariant = colorTokens.find(obj => {
                return obj.name === "ColorDark" + colorName;
            }).attributes;
             */

            fs.writeFileSync(
                `${colorsetPath}/Contents.json`,
                JSON.stringify({
                    colors: [

                        // light
                        {
                            idiom: "universal",
                            color: {
                                "color-space": `srgb`,
                                components: {
                                    red: `${rgb.r}`,
                                    green: `${rgb.g}`,
                                    blue: `${rgb.b}`,
                                    alpha: 1,
                                },
                            },
                        },

                        // dark
                        // disabled for now, as no dark color variants are supplied
                        /*{
                            idiom: "universal",
                            appearances: [{
                                appearance: "luminosity",
                                value: "dark",
                            }, ],
                            color: {
                                "color-space": `srgb`,
                                components: {
                                    red: `${darkVariant.rgb.r}`,
                                    green: `${darkVariant.rgb.g}`,
                                    blue: `${darkVariant.rgb.b}`,
                                    alpha: 1,
                                },
                            },
                        },*/

                    ],
                    ...CONTENTS,
                })
            );
        });
    },
    undo: function(dictionary, platform) {},
};
