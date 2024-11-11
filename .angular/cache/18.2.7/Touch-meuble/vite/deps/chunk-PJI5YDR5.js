import {
  FIREBASE_APP_NAME,
  FIREBASE_OPTIONS,
  ɵapplyMixins,
  ɵcacheInstance,
  ɵfirebaseAppFactory,
  ɵlazySDKProxy
} from "./chunk-P5WCSQHX.js";
import {
  firebase
} from "./chunk-VXWY3GT5.js";
import {
  VERSION,
  keepUnstableUntilFirst,
  ɵAngularFireSchedulers,
  ɵAppCheckInstances
} from "./chunk-GEVHBNB7.js";
import {
  isPlatformServer
} from "./chunk-LWCYPPMW.js";
import {
  Inject,
  Injectable,
  InjectionToken,
  NgModule,
  NgZone,
  Optional,
  PLATFORM_ID,
  setClassMetadata,
  ɵɵdefineInjectable,
  ɵɵdefineInjector,
  ɵɵdefineNgModule,
  ɵɵinject
} from "./chunk-KDR5S3NA.js";
import {
  merge
} from "./chunk-46PD6PMB.js";
import {
  Observable,
  Subject,
  filter,
  first,
  from,
  map,
  observeOn,
  of,
  shareReplay,
  subscribeOn,
  switchMap,
  switchMapTo
} from "./chunk-D5YRXC5P.js";

// node_modules/@angular/fire/fesm2022/angular-fire-compat-auth.mjs
var proxyPolyfillCompat = {
  name: null,
  config: null,
  emulatorConfig: null,
  app: null,
  applyActionCode: null,
  checkActionCode: null,
  confirmPasswordReset: null,
  createUserWithEmailAndPassword: null,
  currentUser: null,
  fetchSignInMethodsForEmail: null,
  isSignInWithEmailLink: null,
  getRedirectResult: null,
  languageCode: null,
  settings: null,
  onAuthStateChanged: null,
  onIdTokenChanged: null,
  sendSignInLinkToEmail: null,
  sendPasswordResetEmail: null,
  setPersistence: null,
  signInAndRetrieveDataWithCredential: null,
  signInAnonymously: null,
  signInWithCredential: null,
  signInWithCustomToken: null,
  signInWithEmailAndPassword: null,
  signInWithPhoneNumber: null,
  signInWithEmailLink: null,
  signInWithPopup: null,
  signInWithRedirect: null,
  signOut: null,
  tenantId: null,
  updateCurrentUser: null,
  useDeviceLanguage: null,
  useEmulator: null,
  verifyPasswordResetCode: null
};
var USE_EMULATOR = new InjectionToken("angularfire2.auth.use-emulator");
var SETTINGS = new InjectionToken("angularfire2.auth.settings");
var TENANT_ID = new InjectionToken("angularfire2.auth.tenant-id");
var LANGUAGE_CODE = new InjectionToken("angularfire2.auth.langugage-code");
var USE_DEVICE_LANGUAGE = new InjectionToken("angularfire2.auth.use-device-language");
var PERSISTENCE = new InjectionToken("angularfire.auth.persistence");
var ɵauthFactory = (app, zone, useEmulator, tenantId, languageCode, useDeviceLanguage, settings, persistence) => ɵcacheInstance(`${app.name}.auth`, "AngularFireAuth", app.name, () => {
  const auth = zone.runOutsideAngular(() => app.auth());
  if (useEmulator) {
    auth.useEmulator(...useEmulator);
  }
  if (tenantId) {
    auth.tenantId = tenantId;
  }
  auth.languageCode = languageCode;
  if (useDeviceLanguage) {
    auth.useDeviceLanguage();
  }
  if (settings) {
    for (const [k, v] of Object.entries(settings)) {
      auth.settings[k] = v;
    }
  }
  if (persistence) {
    auth.setPersistence(persistence);
  }
  return auth;
}, [useEmulator, tenantId, languageCode, useDeviceLanguage, settings, persistence]);
var AngularFireAuth = class _AngularFireAuth {
  /**
   * Observable of authentication state; as of Firebase 4.0 this is only triggered via sign-in/out
   */
  authState;
  /**
   * Observable of the currently signed-in user's JWT token used to identify the user to a Firebase service (or null).
   */
  idToken;
  /**
   * Observable of the currently signed-in user (or null).
   */
  user;
  /**
   * Observable of the currently signed-in user's IdTokenResult object which contains the ID token JWT string and other
   * helper properties for getting different data associated with the token as well as all the decoded payload claims
   * (or null).
   */
  idTokenResult;
  /**
   * Observable of the currently signed-in user's credential, or null
   */
  credential;
  constructor(options, name, platformId, zone, schedulers, useEmulator, settings, tenantId, languageCode, useDeviceLanguage, persistence, _appCheckInstances) {
    const logins = new Subject();
    const auth = of(void 0).pipe(observeOn(schedulers.outsideAngular), switchMap(() => zone.runOutsideAngular(() => import("./index.esm-XSOEYADY.js"))), map(() => ɵfirebaseAppFactory(options, zone, name)), map((app) => ɵauthFactory(app, zone, useEmulator, tenantId, languageCode, useDeviceLanguage, settings, persistence)), shareReplay({
      bufferSize: 1,
      refCount: false
    }));
    if (isPlatformServer(platformId)) {
      this.authState = this.user = this.idToken = this.idTokenResult = this.credential = of(null);
    } else {
      auth.pipe(first()).subscribe();
      const redirectResult = auth.pipe(switchMap((auth2) => auth2.getRedirectResult().then((it) => it, () => null)), keepUnstableUntilFirst, shareReplay({
        bufferSize: 1,
        refCount: false
      }));
      const authStateChanged = auth.pipe(switchMap((auth2) => new Observable((sub) => ({
        unsubscribe: zone.runOutsideAngular(() => auth2.onAuthStateChanged((next) => sub.next(next), (err) => sub.error(err), () => sub.complete()))
      }))));
      const idTokenChanged = auth.pipe(switchMap((auth2) => new Observable((sub) => ({
        unsubscribe: zone.runOutsideAngular(() => auth2.onIdTokenChanged((next) => sub.next(next), (err) => sub.error(err), () => sub.complete()))
      }))));
      this.authState = redirectResult.pipe(switchMapTo(authStateChanged), subscribeOn(schedulers.outsideAngular), observeOn(schedulers.insideAngular));
      this.user = redirectResult.pipe(switchMapTo(idTokenChanged), subscribeOn(schedulers.outsideAngular), observeOn(schedulers.insideAngular));
      this.idToken = this.user.pipe(switchMap((user) => user ? from(user.getIdToken()) : of(null)));
      this.idTokenResult = this.user.pipe(switchMap((user) => user ? from(user.getIdTokenResult()) : of(null)));
      this.credential = merge(
        redirectResult,
        logins,
        // pipe in null authState to make credential zipable, just a weird devexp if
        // authState and user go null to still have a credential
        this.authState.pipe(filter((it) => !it))
      ).pipe(
        // handle the { user: { } } when a user is already logged in, rather have null
        // TODO handle the type corcersion better
        map((credential) => credential?.user ? credential : null),
        subscribeOn(schedulers.outsideAngular),
        observeOn(schedulers.insideAngular)
      );
    }
    return ɵlazySDKProxy(this, auth, zone, {
      spy: {
        apply: (name2, _, val) => {
          if (name2.startsWith("signIn") || name2.startsWith("createUser")) {
            val.then((user) => logins.next(user));
          }
        }
      }
    });
  }
  static ɵfac = function AngularFireAuth_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AngularFireAuth)(ɵɵinject(FIREBASE_OPTIONS), ɵɵinject(FIREBASE_APP_NAME, 8), ɵɵinject(PLATFORM_ID), ɵɵinject(NgZone), ɵɵinject(ɵAngularFireSchedulers), ɵɵinject(USE_EMULATOR, 8), ɵɵinject(SETTINGS, 8), ɵɵinject(TENANT_ID, 8), ɵɵinject(LANGUAGE_CODE, 8), ɵɵinject(USE_DEVICE_LANGUAGE, 8), ɵɵinject(PERSISTENCE, 8), ɵɵinject(ɵAppCheckInstances, 8));
  };
  static ɵprov = ɵɵdefineInjectable({
    token: _AngularFireAuth,
    factory: _AngularFireAuth.ɵfac,
    providedIn: "any"
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AngularFireAuth, [{
    type: Injectable,
    args: [{
      providedIn: "any"
    }]
  }], () => [{
    type: void 0,
    decorators: [{
      type: Inject,
      args: [FIREBASE_OPTIONS]
    }]
  }, {
    type: void 0,
    decorators: [{
      type: Optional
    }, {
      type: Inject,
      args: [FIREBASE_APP_NAME]
    }]
  }, {
    type: Object,
    decorators: [{
      type: Inject,
      args: [PLATFORM_ID]
    }]
  }, {
    type: NgZone
  }, {
    type: ɵAngularFireSchedulers
  }, {
    type: void 0,
    decorators: [{
      type: Optional
    }, {
      type: Inject,
      args: [USE_EMULATOR]
    }]
  }, {
    type: void 0,
    decorators: [{
      type: Optional
    }, {
      type: Inject,
      args: [SETTINGS]
    }]
  }, {
    type: void 0,
    decorators: [{
      type: Optional
    }, {
      type: Inject,
      args: [TENANT_ID]
    }]
  }, {
    type: void 0,
    decorators: [{
      type: Optional
    }, {
      type: Inject,
      args: [LANGUAGE_CODE]
    }]
  }, {
    type: void 0,
    decorators: [{
      type: Optional
    }, {
      type: Inject,
      args: [USE_DEVICE_LANGUAGE]
    }]
  }, {
    type: void 0,
    decorators: [{
      type: Optional
    }, {
      type: Inject,
      args: [PERSISTENCE]
    }]
  }, {
    type: ɵAppCheckInstances,
    decorators: [{
      type: Optional
    }]
  }], null);
})();
ɵapplyMixins(AngularFireAuth, [proxyPolyfillCompat]);
var AngularFireAuthModule = class _AngularFireAuthModule {
  constructor() {
    firebase.registerVersion("angularfire", VERSION.full, "auth-compat");
  }
  static ɵfac = function AngularFireAuthModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AngularFireAuthModule)();
  };
  static ɵmod = ɵɵdefineNgModule({
    type: _AngularFireAuthModule
  });
  static ɵinj = ɵɵdefineInjector({
    providers: [AngularFireAuth]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AngularFireAuthModule, [{
    type: NgModule,
    args: [{
      providers: [AngularFireAuth]
    }]
  }], () => [], null);
})();

export {
  USE_EMULATOR,
  SETTINGS,
  TENANT_ID,
  LANGUAGE_CODE,
  USE_DEVICE_LANGUAGE,
  PERSISTENCE,
  ɵauthFactory,
  AngularFireAuth,
  AngularFireAuthModule
};
//# sourceMappingURL=chunk-PJI5YDR5.js.map
