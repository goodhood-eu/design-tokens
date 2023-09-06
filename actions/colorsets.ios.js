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
            var colorName = name.replace(/ColorSemantic[A-Z][a-z0-9]*/, "").replace("ColorPrimitive", "");
            colorName = colorName.charAt(0).toLowerCase() + colorName.slice(1);
            const colorsetPath = `${assetPath}/${colorName}.colorset`;
            createDir(colorsetPath);

            fs.writeFileSync(
                `${colorsetPath}/Contents.json`,
                JSON.stringify({
                    colors: [
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
                    ],
                    ...CONTENTS,
                })
            );
        });
    },
    undo: function(dictionary, platform) {},
};
