/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {html, LitElement, nothing, PropertyValues} from 'lit';
import {property} from 'lit/decorators.js';
import {classMap} from 'lit/directives/class-map.js';

import {ARIAMixinStrict} from '../../../internal/aria/aria.js';
import {requestUpdateOnAriaChange} from '../../../internal/aria/delegate.js';

/**
 * TODO(b/265346501): add docs
 */
export class NavigationDrawerModal extends LitElement {
  static {
    requestUpdateOnAriaChange(NavigationDrawerModal);
  }

  @property({type: Boolean}) opened = false;
  @property() pivot: 'start' | 'end' = 'end';

  protected override render() {
    const ariaExpanded = this.opened ? 'true' : 'false';
    const ariaHidden = !this.opened ? 'true' : 'false';
    // Needed for closure conformance
    const {ariaLabel, ariaModal} = this as ARIAMixinStrict;
    return html`
      <div
        class="md3-navigation-drawer-modal__scrim ${this.getScrimClasses()}"
        @click="${this.handleScrimClick}">
      </div>
      <div
        aria-expanded=${ariaExpanded}
        aria-hidden=${ariaHidden}
        aria-label=${ariaLabel || nothing}
        aria-modal=${ariaModal || nothing}
        class="md3-navigation-drawer-modal ${this.getRenderClasses()}"
        @keydown="${this.handleKeyDown}"
        role="dialog"
        ><div class="md3-elevation-overlay"></div>
        <div class="md3-navigation-drawer-modal__slot-content">
          <slot></slot>
        </div>
      </div>
    `;
  }

  private getScrimClasses() {
    return classMap({
      'md3-navigation-drawer-modal--scrim-visible': this.opened,
    });
  }

  private getRenderClasses() {
    return classMap({
      'md3-navigation-drawer-modal--opened': this.opened,
      'md3-navigation-drawer-modal--pivot-at-start': this.pivot === 'start',
    });
  }

  protected override updated(
    changedProperties: PropertyValues<NavigationDrawerModal>,
  ) {
    if (changedProperties.has('opened')) {
      setTimeout(() => {
        this.dispatchEvent(
          new CustomEvent('navigation-drawer-changed', {
            detail: {opened: this.opened},
            bubbles: true,
            composed: true,
          }),
        );
      }, 250);
    }
  }

  private handleKeyDown(event: KeyboardEvent) {
    if (event.code === 'Escape') {
      this.opened = false;
    }
  }

  private handleScrimClick() {
    this.opened = !this.opened;
  }
}
