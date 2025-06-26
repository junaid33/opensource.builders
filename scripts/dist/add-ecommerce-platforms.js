#!/usr/bin/env tsx
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
Object.defineProperty(exports, "__esModule", { value: true });
var graphql_request_1 = require("graphql-request");
var KEYSTONE_SESSION = 'Fe26.2**f01b43b5a809c74981b635dc8690e89b725b1dafc82b9001b4cd2986d18b446a*jR97gvVwTXthvz8BKLVUwg*11ecm4NkfrXx7ke9ttZ97Vb_jkdq6ILQD_sf0J_Mh1EUZ_Jfvp4Ntx15ONkHn2qFRgZ2u9v8v91H1zpjxdJJSg*1781930136593*1ac5010e49cc94bea22c3e2c01bd4b0c79ab48e39dad7b0f3819b2153a4823aa*R1uGMlKaUxHp8cLTsMSuKS5URMauAhe-cKr9KEq3-Aw';
var client = new graphql_request_1.GraphQLClient('http://localhost:3000/api/graphql', {
    headers: {
        'authorization': "Bearer ".concat(KEYSTONE_SESSION),
        'cookie': "keystonejs-session=".concat(KEYSTONE_SESSION)
    }
});
var ecommercePlatforms = [
    {
        name: 'PrestaShop',
        slug: 'prestashop',
        description: 'Free, open source and fully customizable e-commerce solution with powerful features for creating online stores.',
        websiteUrl: 'https://prestashop.com',
        repositoryUrl: 'https://github.com/PrestaShop/PrestaShop',
        githubStars: 7800,
        license: 'OSL-3.0',
        logoSvg: "<svg width=\"56\" height=\"56\" viewBox=\"0 0 56 56\" xmlns=\"http://www.w3.org/2000/svg\">\n                <circle cx=\"28\" cy=\"28\" r=\"28\" fill=\"#DF0067\"/>\n                <text x=\"28\" y=\"28\" dy=\"0.35em\" text-anchor=\"middle\" \n                      fill=\"white\" font-family=\"system-ui, sans-serif\" \n                      font-size=\"28\" font-weight=\"600\">P</text>\n              </svg>"
    },
    {
        name: 'Bagisto',
        slug: 'bagisto',
        description: 'Free & Opensource Laravel eCommerce framework built for all to build and scale your business.',
        websiteUrl: 'https://bagisto.com',
        repositoryUrl: 'https://github.com/bagisto/bagisto',
        githubStars: 10400,
        license: 'MIT',
        logoSvg: "<svg width=\"56\" height=\"56\" viewBox=\"0 0 56 56\" xmlns=\"http://www.w3.org/2000/svg\">\n                <circle cx=\"28\" cy=\"28\" r=\"28\" fill=\"#FF6B35\"/>\n                <text x=\"28\" y=\"28\" dy=\"0.35em\" text-anchor=\"middle\" \n                      fill=\"white\" font-family=\"system-ui, sans-serif\" \n                      font-size=\"28\" font-weight=\"600\">B</text>\n              </svg>"
    },
    {
        name: 'Medusa',
        slug: 'medusa',
        description: 'The open-source Shopify alternative. A modular commerce stack built with Node.js.',
        websiteUrl: 'https://medusajs.com',
        repositoryUrl: 'https://github.com/medusajs/medusa',
        githubStars: 22000,
        license: 'MIT',
        logoSvg: "<svg width=\"56\" height=\"56\" viewBox=\"0 0 56 56\" xmlns=\"http://www.w3.org/2000/svg\">\n                <circle cx=\"28\" cy=\"28\" r=\"28\" fill=\"#7C3AED\"/>\n                <text x=\"28\" y=\"28\" dy=\"0.35em\" text-anchor=\"middle\" \n                      fill=\"white\" font-family=\"system-ui, sans-serif\" \n                      font-size=\"28\" font-weight=\"600\">M</text>\n              </svg>"
    },
    {
        name: 'Sylius',
        slug: 'sylius',
        description: 'Open Source eCommerce Platform on Symfony. Modern PHP e-commerce solution for sophisticated applications.',
        websiteUrl: 'https://sylius.com',
        repositoryUrl: 'https://github.com/Sylius/Sylius',
        githubStars: 7800,
        license: 'MIT',
        logoSvg: "<svg width=\"56\" height=\"56\" viewBox=\"0 0 56 56\" xmlns=\"http://www.w3.org/2000/svg\">\n                <circle cx=\"28\" cy=\"28\" r=\"28\" fill=\"#1ABC9C\"/>\n                <text x=\"28\" y=\"28\" dy=\"0.35em\" text-anchor=\"middle\" \n                      fill=\"white\" font-family=\"system-ui, sans-serif\" \n                      font-size=\"28\" font-weight=\"600\">S</text>\n              </svg>"
    },
    {
        name: 'Vue Storefront',
        slug: 'vue-storefront',
        description: 'Frontend as a Service for eCommerce. Build blazing-fast storefronts that convert better.',
        websiteUrl: 'https://vuestorefront.io',
        repositoryUrl: 'https://github.com/vuestorefront/vue-storefront',
        githubStars: 10400,
        license: 'MIT',
        logoSvg: "<svg width=\"56\" height=\"56\" viewBox=\"0 0 56 56\" xmlns=\"http://www.w3.org/2000/svg\">\n                <circle cx=\"28\" cy=\"28\" r=\"28\" fill=\"#4FC08D\"/>\n                <text x=\"28\" y=\"28\" dy=\"0.35em\" text-anchor=\"middle\" \n                      fill=\"white\" font-family=\"system-ui, sans-serif\" \n                      font-size=\"28\" font-weight=\"600\">V</text>\n              </svg>"
    },
    {
        name: 'Saleor',
        slug: 'saleor',
        description: 'Headless, GraphQL commerce platform delivering ultra-fast, dynamic, personalized shopping experiences.',
        websiteUrl: 'https://saleor.io',
        repositoryUrl: 'https://github.com/saleor/saleor',
        githubStars: 20000,
        license: 'BSD-3-Clause',
        logoSvg: "<svg width=\"56\" height=\"56\" viewBox=\"0 0 56 56\" xmlns=\"http://www.w3.org/2000/svg\">\n                <circle cx=\"28\" cy=\"28\" r=\"28\" fill=\"#06B6D4\"/>\n                <text x=\"28\" y=\"28\" dy=\"0.35em\" text-anchor=\"middle\" \n                      fill=\"white\" font-family=\"system-ui, sans-serif\" \n                      font-size=\"28\" font-weight=\"600\">S</text>\n              </svg>"
    }
];
function createPlatform(platform) {
    return __awaiter(this, void 0, void 0, function () {
        var mutation, data, result, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mutation = "\n    mutation CreateTool($data: ToolCreateInput!) {\n      createTool(data: $data) {\n        id\n        name\n        slug\n      }\n    }\n  ";
                    data = __assign(__assign({}, platform), { isOpenSource: true, category: {
                            connect: {
                                slug: 'ecommerce'
                            }
                        } });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, client.request(mutation, { data: data })];
                case 2:
                    result = _a.sent();
                    console.log("\u2705 Created ".concat(platform.name, ":"), result.createTool);
                    return [2 /*return*/, result.createTool];
                case 3:
                    error_1 = _a.sent();
                    console.error("\u274C Failed to create ".concat(platform.name, ":"), error_1);
                    return [2 /*return*/, null];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function updateWooCommerceLogo() {
    return __awaiter(this, void 0, void 0, function () {
        var mutation, woocommerceLogo, result, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mutation = "\n    mutation UpdateWooCommerce($id: ID!, $data: ToolUpdateInput!) {\n      updateTool(where: { id: $id }, data: $data) {\n        id\n        name\n        logoSvg\n      }\n    }\n  ";
                    woocommerceLogo = "<svg width=\"56\" height=\"56\" viewBox=\"0 0 56 56\" xmlns=\"http://www.w3.org/2000/svg\">\n                            <rect width=\"56\" height=\"56\" rx=\"8\" fill=\"#96588A\"/>\n                            <path d=\"M14 20h28v16H14z\" fill=\"white\"/>\n                            <path d=\"M16 28l10 6 10-6 6 3v10H10V31z\" fill=\"#96588A\"/>\n                          </svg>";
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, client.request(mutation, {
                            id: 'cmbjbhoqy002ke6qfd7mtu4jv',
                            data: { logoSvg: woocommerceLogo }
                        })];
                case 2:
                    result = _a.sent();
                    console.log('✅ Updated WooCommerce logo:', result.updateTool);
                    return [2 /*return*/, result.updateTool];
                case 3:
                    error_2 = _a.sent();
                    console.error('❌ Failed to update WooCommerce logo:', error_2);
                    return [2 /*return*/, null];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function createAlternativeRelationships(toolIds) {
    return __awaiter(this, void 0, void 0, function () {
        var shopifyQuery, shopifyResult, shopifyId, _i, toolIds_1, toolId, createAlternativeMutation, result, error_3, error_4;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    console.log('\n🔗 Creating alternative relationships with Shopify...');
                    shopifyQuery = "\n    query GetShopify {\n      tools(where: { name: { equals: \"Shopify\" } }) {\n        id\n      }\n    }\n  ";
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 9, , 10]);
                    return [4 /*yield*/, client.request(shopifyQuery)];
                case 2:
                    shopifyResult = _b.sent();
                    shopifyId = (_a = shopifyResult.tools[0]) === null || _a === void 0 ? void 0 : _a.id;
                    if (!shopifyId) {
                        console.error('❌ Shopify not found in database');
                        return [2 /*return*/];
                    }
                    _i = 0, toolIds_1 = toolIds;
                    _b.label = 3;
                case 3:
                    if (!(_i < toolIds_1.length)) return [3 /*break*/, 8];
                    toolId = toolIds_1[_i];
                    createAlternativeMutation = "\n        mutation CreateAlternative($data: AlternativeCreateInput!) {\n          createAlternative(data: $data) {\n            id\n            openSourceTool { name }\n            proprietaryTool { name }\n          }\n        }\n      ";
                    _b.label = 4;
                case 4:
                    _b.trys.push([4, 6, , 7]);
                    return [4 /*yield*/, client.request(createAlternativeMutation, {
                            data: {
                                openSourceTool: { connect: { id: toolId } },
                                proprietaryTool: { connect: { id: shopifyId } }
                            }
                        })];
                case 5:
                    result = _b.sent();
                    console.log("\u2705 Created alternative relationship: ".concat(result.createAlternative.openSourceTool.name, " \u2194 ").concat(result.createAlternative.proprietaryTool.name));
                    return [3 /*break*/, 7];
                case 6:
                    error_3 = _b.sent();
                    console.error('❌ Failed to create alternative relationship:', error_3);
                    return [3 /*break*/, 7];
                case 7:
                    _i++;
                    return [3 /*break*/, 3];
                case 8: return [3 /*break*/, 10];
                case 9:
                    error_4 = _b.sent();
                    console.error('❌ Failed to get Shopify ID:', error_4);
                    return [3 /*break*/, 10];
                case 10: return [2 /*return*/];
            }
        });
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var createdTools, _i, ecommercePlatforms_1, platform, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('🚀 Adding e-commerce platforms...\n');
                    // Update WooCommerce logo first
                    return [4 /*yield*/, updateWooCommerceLogo()];
                case 1:
                    // Update WooCommerce logo first
                    _a.sent();
                    createdTools = [];
                    _i = 0, ecommercePlatforms_1 = ecommercePlatforms;
                    _a.label = 2;
                case 2:
                    if (!(_i < ecommercePlatforms_1.length)) return [3 /*break*/, 5];
                    platform = ecommercePlatforms_1[_i];
                    return [4 /*yield*/, createPlatform(platform)];
                case 3:
                    result = _a.sent();
                    if (result === null || result === void 0 ? void 0 : result.id) {
                        createdTools.push(result.id);
                    }
                    _a.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 2];
                case 5:
                    if (!(createdTools.length > 0)) return [3 /*break*/, 7];
                    return [4 /*yield*/, createAlternativeRelationships(createdTools)];
                case 6:
                    _a.sent();
                    _a.label = 7;
                case 7:
                    console.log("\n\uD83C\uDF89 Completed! Created ".concat(createdTools.length, " new e-commerce platforms."));
                    console.log('💡 Now you can test the Shopify alternatives page with more options!');
                    return [2 /*return*/];
            }
        });
    });
}
main().catch(console.error);
