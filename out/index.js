"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var release_please_1 = require("release-please");
var process_1 = require("process");
var yaml = require("js-yaml");
//TODO add support for manifest
function runPlugin() {
    return __awaiter(this, void 0, void 0, function () {
        var ghToken, ghRepoURL, github, manifest;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("Plugin Execution");
                    ghToken = process_1.env.PLUGIN_GITHUB_TOKEN;
                    ghRepoURL = process_1.env.PLUGIN_REPO_URL;
                    if (!ghToken) {
                        console.error("Please provide the Git repository token with write permissions");
                        process.exit(1);
                    }
                    if (!ghRepoURL) {
                        console.error("Please provide the Git repository url in <owner>/<repo> format token with write permissions");
                        process.exit(1);
                    }
                    return [4 /*yield*/, getGitHubInstance()];
                case 1:
                    github = _a.sent();
                    return [4 /*yield*/, getManifestInstance(github)];
                case 2:
                    manifest = _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function getGitHubInstance() {
    var _a = getGitHubInput(), token = _a.token, defaultBranch = _a.defaultBranch, apiUrl = _a.apiUrl, graphqlUrl = _a.graphqlUrl, repoUrl = _a.repoUrl;
    var _b = repoUrl.split("/"), owner = _b[0], repo = _b[1];
    var targetBranch = defaultBranch ? defaultBranch : "main";
    var githubCreateOpts = {
        owner: owner,
        repo: repo,
        apiUrl: apiUrl,
        graphqlUrl: graphqlUrl,
        token: token,
        defaultBranch: targetBranch
    };
    return release_please_1.GitHub.create(githubCreateOpts);
}
function getGitHubInput() {
    var fork = process_1.env.PLUGIN_FORK ? true : false;
    var apiUrl = process_1.env.PLUGIN_API_URL;
    var repoUrl = process_1.env.PLUGIN_REPO_URL;
    var token = process_1.env.PLUGIN_GITHB_TOKEN;
    var graphqlUrl = process_1.env.PLUGIN_GRAPHQL_URL;
    var defaultBranch = process_1.env.PLUGIN_TARGET_BRANCH;
    return {
        token: token,
        defaultBranch: defaultBranch,
        apiUrl: apiUrl,
        graphqlUrl: graphqlUrl,
        repoUrl: repoUrl
    };
}
function getManifestInstance(github) {
    return __awaiter(this, void 0, void 0, function () {
        var settingsExtraOpts, xtraOpts;
        return __generator(this, function (_a) {
            settingsExtraOpts = process_1.env.PLUGIN_EXTRA_OPTIONS;
            if (settingsExtraOpts) {
                xtraOpts = yaml.load(settingsExtraOpts);
                if (xtraOpts) {
                    console.log(JSON.stringify(xtraOpts));
                }
            }
            return [2 /*return*/];
        });
    });
}
runPlugin()
    .then()["catch"](function (err) { return console.log("Error:".concat(err)); });
