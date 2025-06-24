import { 
	Plugin, TFile
} from 'obsidian';


import {
        DEFAULT_SETTINGS,
        ImageWidthSliderSettingTab
} from "./settings/settings";

import {
        ImageWidthSliderSettings
} from './types/settings';


import { 
	WarningModal 
} from './modal/warning';

// ---------------------------- Plugin Class -----------------------------------
export default class ImageWidthSlider extends Plugin {
        settings: ImageWidthSliderSettings;

	// most important function, this gets executed everytime the plugin is first 
	// loaded, e.g. when obsidian starts, or when the user just installed the 
	// plugin
        async onload() {
                await this.loadSettings();

                this.addStyle();

                this.app.workspace.on('file-open', () => {
                        this.updateImageStyleYAML();
                });

                this.createSlider();

                this.addSettingTab(new ImageWidthSliderSettingTab(this.app, this));

	}

	// async onLoadFile(file: TFile) {
		

	// }

	onunload() {
                this.cleanUpResources();
	}
	
	// ---------------------------- SLIDER -------------------------------------
	createSlider() {

                // Create the slider element
                const slider = document.createElement('input');
                slider.classList.add('image-width-slider');
                slider.id = 'image-width-slider';
                slider.type = 'range';
                slider.min = '0';
                slider.max = '100';
                slider.value = this.settings.sliderPercentage;
                // Adjust the width value as needed
                slider.style.width = this.settings.sliderWidth + 'px';
		
                // Add event listener to the slider
                slider.addEventListener('input', (event) => {
                        const value = parseInt(slider.value);
                        this.settings.sliderPercentage = value.toString();
                        this.saveSettings();
                        if (this.settings.sliderEnabled) {
                                this.updateImageStyle();
                        }
                        sliderValueText.textContent = value.toString();
                        console.log('Slider value:', value);
                });

		// Create the text element for displaying the slider value
		const sliderValueText = document.createElement('span');
		sliderValueText.textContent = slider.value;
                sliderValueText.classList.add('image-width-slider-value');
                sliderValueText.id = 'image-width-slider-value';

		// Add the CSS properties to the span element
		sliderValueText.style.color = 'white';
		sliderValueText.style.padding = '4px 3px';
		sliderValueText.style.display = 'inline';
		sliderValueText.style.borderRadius = '18%';
		sliderValueText.style.border = '0';
		sliderValueText.style.margin = '0px 5px';
		sliderValueText.style.background = 'var(--interactive-accent)';
		sliderValueText.style.fontSize = '9px';
		sliderValueText.style.lineHeight = '50%';
		sliderValueText.style.width = 'auto';
		sliderValueText.style.height = 'auto';
		sliderValueText.style.boxSizing = 'content-box';

		// Add a hover effect to change the background color to red
		sliderValueText.style.transition = 'background 0.3s'; // Add smooth transition
		sliderValueText.style.cursor = 'pointer'; // Change cursor on hover
		sliderValueText.addEventListener('mouseenter', function() {
			sliderValueText.style.background = 'red';
		});
		sliderValueText.addEventListener('mouseleave', function() {
			sliderValueText.style.background = 'var(--interactive-accent)';
		});

		// Add a click event listener to the slider value text
		sliderValueText.addEventListener('click', () => {
                        this.resetImageWidth()
		});

                // Create the toggle button
                const toggleButton = document.createElement('button');
                toggleButton.id = 'image-width-slider-toggle';
                toggleButton.textContent = this.settings.sliderEnabled ? 'Disable' : 'Enable';
                toggleButton.style.marginLeft = '5px';
                toggleButton.addEventListener('click', () => {
                        this.settings.sliderEnabled = !this.settings.sliderEnabled;
                        toggleButton.textContent = this.settings.sliderEnabled ? 'Disable' : 'Enable';
                        if (this.settings.sliderEnabled) {
                                this.updateImageStyleYAML();
                        } else {
                                this.removeImageStyle();
                        }
                        this.saveSettings();
                });

                // Create the status bar item
                const statusBarItemEl = this.addStatusBarItem();
                // Append the slider to the status bar item
                statusBarItemEl.appendChild(slider);
                statusBarItemEl.appendChild(sliderValueText);
                statusBarItemEl.appendChild(toggleButton);
        }
	// ---------------------------- SLIDER -------------------------------------

        cleanUpResources() {
                this.resetImageWidth();
                this.removeImageStyle();
        }

        resetImageWidth() {
                // const widthInPixels = 400 + value * 10;
                this.settings.sliderPercentage = this.settings.sliderPercentageDefault;

		// get the custom css element
                const styleElements = document.getElementsByClassName('image-width-slider');
                const slider = document.getElementById('image-width-slider') as HTMLInputElement;
                const sliderValue = document.getElementById('image-width-slider-value') as HTMLInputElement;
		if (slider) {
			if (sliderValue) {
				slider.value = this.settings.sliderPercentageDefault;
				sliderValue.textContent = this.settings.sliderPercentageDefault.toString();
			}
		}

                this.saveSettings();
                if (this.settings.sliderEnabled) {
                        this.updateImageStyleYAML();
                } else {
                        this.removeImageStyle();
                }
        }

	// add element that contains all of the styling elements we need
	addStyle() {
		// add a css block for our settings-dependent styles
                const css = document.createElement('style');
                css.id = 'additional-image-css';
		document.getElementsByTagName("head")[0].appendChild(css);

		// add the main class
                document.body.classList.add('image-width-slider-target');

		// update the style with the settings-dependent styles
        // this.updateImageStyle();
	}

	
	// update the styles (at the start, or as the result of a settings change)
        updateImageStyle() {
                if (!this.settings.sliderEnabled) {
                        return;
                }
                const styleElement = document.getElementById('additional-image-css');
                if (!styleElement) throw "additional-image-css element not found!";
                const unit = this.settings.unit;
                const excludedClasses = this.settings.excludedParentClasses
                        .split(',')
                        .map(c => c.trim())
                        .filter(c => c);
                if (!excludedClasses.includes('oit')) excludedClasses.push('oit');
                const excludedClasses = this.settings.excludedParentClasses
                        .split(',')
                        .map(c => c.trim())
                        .filter(c => c);
                if (!excludedClasses.includes('oit')) excludedClasses.push('oit');
                        .map(c => c.trim())
                        .filter(c => c);
                if (!excludedClasses.includes('oit')) excludedClasses.push('oit');
                const excludeRules = excludedClasses.map(cls => `.image-width-slider-target .${cls} img {\n                                width: auto !important;\n                        }`).join('\n');
                styleElement.innerText = `
                        .image-width-slider-target img {
                                width: ${this.settings.sliderPercentage}${unit} !important;
                        }
                        ${excludeRules}
                `;
        }


	// update the styles (at the start, or as the result of a settings change)
        updateImageStyleYAMLHelper(imageWidth: any) {
                if (!this.settings.sliderEnabled) {
                        return;
                }
                const styleElement = document.getElementById('additional-image-css');
                if (!styleElement) throw "additional-image-css element not found!";
                const unit = this.settings.unit;
                const excludedClasses = this.settings.excludedParentClasses
                        .split(',')
                        .map(c => c.trim())
                        .filter(c => c);
                if (!excludedClasses.includes('oit')) excludedClasses.push('oit');
                const excludeRules = excludedClasses.map(cls => `.image-width-slider-target .${cls} img {\n                                width: auto !important;\n                        }`).join('\n');
                styleElement.innerText = `
                        .image-width-slider-target img {
                                width: ${imageWidth}${unit} !important;
                        }
                        ${excludeRules}
                `;
        }

	pattern = /^(?:[0-9]{1,2}|100)$/;

	validateString(inputString: string): boolean {
		return this.pattern.test(inputString);
	}

        updateImageStyleYAML() {
                if (!this.settings.sliderEnabled) {
                        this.removeImageStyle();
                        return;
                }
                // if there is yaml frontmatter, take info from yaml, otherwise take info from slider
                const file = this.app.workspace.getActiveFile() as TFile; // Currently Open Note
                if(file.name) {
			const metadata = app.metadataCache.getFileCache(file);
			// const metadata = app.vault.metadataCache.getFileCache(file);
			if (metadata) {
				if (metadata.frontmatter) {
					try {
                                                if (metadata.frontmatter["image-width"]) {
                                                        if (this.validateString(metadata.frontmatter["image-width"])) {
                                                                this.updateImageStyleYAMLHelper(metadata.frontmatter["image-width"]);
                                                        } else {
                                                                new WarningModal(this.app).open();
                                                                throw new Error("Image width must be a number from 0 to 100.");
                                                        }
                                                } else {
                                                        this.updateImageStyle();
                                                }
                                        } catch (e) {
						console.error("Error:", e.message);
					}
				} else {
                                        this.updateImageStyle();
				}
			}
		}
		// return; // Nothing Open
	}

	// update the styles (at the start, or as the result of a settings change)
        updateSliderStyle() {
                // get the custom css element
                const styleElements = document.getElementsByClassName('image-width-slider');
		
		if (styleElements.length === 0) {
                        throw new Error("image-width-slider-value element not found!");
		} else {
			// Access the first element in the collection and modify its style
			const styleElement = styleElements[0] as HTMLElement;
			styleElement.style.width = this.settings.sliderWidth + 'px';
                }
        }

        removeImageStyle() {
                const styleElement = document.getElementById('additional-image-css');
                if (styleElement) {
                        styleElement.innerText = '';
                }
        }


	// Method to load settings
	async loadSettings() {
		this.settings = Object.assign(
			{}, 
			DEFAULT_SETTINGS, 
			await this.loadData()
		);
	}

	// Method to store settings
	async saveSettings() {
		await this.saveData(this.settings);
	}

}
// ---------------------------- Plugin Class -----------------------------------
