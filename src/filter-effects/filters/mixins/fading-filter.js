import { packageId } from "../../../constants.js";
import { FXMasterFilterEffectMixin } from "./filter";

/**
 * @typedef {Object} AnimationOptions
 * @property {number} [duration=4000] The duration of the animation
 */

/**
 * A mixin which extends {@link PIXI.Filter} with some common behavior and fading.
 * @param {PIXI.Filter} Base The base filter class which this mixin extends
 * @returns The extended filter class
 */
export function FadingFilterMixin(Base) {
  return class extends FXMasterFilterEffectMixin(Base) {
    /**
     * The currently running animation, if any.
     * @type {Promise<boolean> | undefined}
     */
    currentAnimation;

    /**
     * Apply options to this filter effect as an animation.
     * @param {object} [options] The options to animate
     * @param {AnimationOptions} [animationOptions={}] Additional options to adjust the animation behavior
     */
    async animateOptions(options = this.options, { duration = 4_000 } = {}) {
      const name = `${packageId}.${this.constructor.name}.${this.id}`;
      if (this.currentAnimation !== undefined) {
        CanvasAnimation.terminateAnimation(name);
        await this.currentAnimation;
      }
      const data = { name, duration };
      const anim = Object.entries(options).map(([key, value]) => ({
        parent: this.optionContext,
        attribute: key,
        to: value,
      }));
      this.currentAnimation = CanvasAnimation.animate(anim, data).finally(() => (this.currentAnimation = undefined));
      return this.currentAnimation;
    }

    /** @override */
    play({ skipFading = false, ...otherOptions } = {}) {
      if (skipFading) {
        super.play({ skipFading, ...otherOptions });
      } else {
        this.enabled = true;
        this.animateOptions();
      }
    }

    /** @override */
    async stop({ skipFading = false, ...otherOptions } = {}) {
      if (skipFading) {
        return super.stop({ skipFading, ...otherOptions });
      } else {
        const completed = await this.animateOptions(this.constructor.neutral);
        if (completed) {
          this.enabled = false;
        }
        return completed;
      }
    }
  };
}
