#!/usr/bin/env tsx
"use strict";
/**
 * Analyze tool data structure for individual tool pages
 * Focus on: Tools, Features, Alternatives, Categories, TechStacks, DeploymentOptions
 * Ignore: Flows (to be deleted)
 */
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
exports.analyzeToolData = analyzeToolData;
function analyzeToolData() {
    return __awaiter(this, void 0, void 0, function () {
        var query, response, result, data, analysis;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    query = "\n    query AnalyzeToolData {\n      # Get all tools with their relationships\n      tools {\n        id\n        name\n        slug\n        description\n        logoUrl\n        logoSvg\n        isOpenSource\n        category {\n          id\n          name\n          slug\n        }\n        features {\n          feature {\n            id\n            name\n            featureType\n          }\n        }\n        proprietaryAlternatives {\n          proprietaryTool {\n            id\n            name\n          }\n        }\n        openSourceAlternatives {\n          openSourceTool {\n            id\n            name\n          }\n        }\n        techStacks {\n          techStack {\n            id\n            name\n          }\n        }\n        deploymentOptions {\n          id\n          platform\n          difficulty\n          estimatedTime\n        }\n      }\n      \n      # Get all features\n      features {\n        id\n        name\n        featureType\n        tools {\n          tool {\n            id\n          }\n        }\n      }\n      \n      # Get all categories\n      categories {\n        id\n        name\n        slug\n        tools {\n          id\n        }\n      }\n      \n      # Get all tech stacks\n      techStacks {\n        id\n        name\n        tools {\n          tool {\n            id\n          }\n        }\n      }\n      \n      # Get all deployment options\n      deploymentOptions {\n        id\n        platform\n        difficulty\n        estimatedTime\n        tool {\n          id\n        }\n      }\n    }\n  ";
                    return [4 /*yield*/, fetch('http://localhost:3000/api/graphql', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ query: query })
                        })];
                case 1:
                    response = _a.sent();
                    if (!response.ok) {
                        throw new Error("GraphQL request failed: ".concat(response.statusText));
                    }
                    return [4 /*yield*/, response.json()];
                case 2:
                    result = _a.sent();
                    if (result.errors) {
                        console.error('GraphQL errors:', result.errors);
                        throw new Error('GraphQL query failed');
                    }
                    data = result.data;
                    analysis = {
                        totalTools: data.tools.length,
                        toolsWithFeatures: data.tools.filter(function (tool) { return tool.features.length > 0; }).length,
                        toolsWithAlternatives: data.tools.filter(function (tool) {
                            return tool.proprietaryAlternatives.length > 0 || tool.openSourceAlternatives.length > 0;
                        }).length,
                        toolsWithLogos: data.tools.filter(function (tool) { return tool.logoSvg || tool.logoUrl; }).length,
                        featuresBreakdown: {
                            total: data.features.length,
                            byType: data.features.reduce(function (acc, feature) {
                                var type = feature.featureType || 'Unknown';
                                acc[type] = (acc[type] || 0) + 1;
                                return acc;
                            }, {})
                        },
                        alternativesBreakdown: {
                            totalRelationships: data.tools.reduce(function (sum, tool) {
                                return sum + tool.proprietaryAlternatives.length + tool.openSourceAlternatives.length;
                            }, 0),
                            openSourceTools: data.tools.filter(function (tool) { return tool.isOpenSource; }).length,
                            proprietaryTools: data.tools.filter(function (tool) { return !tool.isOpenSource; }).length
                        },
                        categoriesBreakdown: {
                            total: data.categories.length,
                            toolsPerCategory: data.categories.reduce(function (acc, category) {
                                acc[category.name] = category.tools.length;
                                return acc;
                            }, {})
                        },
                        techStacksBreakdown: {
                            total: data.techStacks.length,
                            mostUsedStacks: data.techStacks
                                .map(function (stack) { return ({
                                name: stack.name,
                                count: stack.tools.length
                            }); })
                                .sort(function (a, b) { return b.count - a.count; })
                                .slice(0, 10)
                        },
                        deploymentOptionsBreakdown: {
                            total: data.deploymentOptions.length,
                            optionCounts: data.deploymentOptions.reduce(function (acc, option) {
                                var platform = option.platform || 'Unknown';
                                acc[platform] = (acc[platform] || 0) + 1;
                                return acc;
                            }, {})
                        }
                    };
                    return [2 /*return*/, analysis];
            }
        });
    });
}
function displayAnalysis(analysis) {
    console.log('🔍 TOOL DATA ANALYSIS');
    console.log('====================');
    console.log('\n📊 OVERVIEW:');
    console.log("Total Tools: ".concat(analysis.totalTools));
    console.log("Tools with Features: ".concat(analysis.toolsWithFeatures, " (").concat(Math.round(analysis.toolsWithFeatures / analysis.totalTools * 100), "%)"));
    console.log("Tools with Alternatives: ".concat(analysis.toolsWithAlternatives, " (").concat(Math.round(analysis.toolsWithAlternatives / analysis.totalTools * 100), "%)"));
    console.log("Tools with Logos: ".concat(analysis.toolsWithLogos, " (").concat(Math.round(analysis.toolsWithLogos / analysis.totalTools * 100), "%)"));
    console.log('\n🎯 FEATURES:');
    console.log("Total Features: ".concat(analysis.featuresBreakdown.total));
    console.log('Feature Types:');
    Object.entries(analysis.featuresBreakdown.byType)
        .sort(function (_a, _b) {
        var a = _a[1];
        var b = _b[1];
        return b - a;
    })
        .forEach(function (_a) {
        var type = _a[0], count = _a[1];
        console.log("  ".concat(type, ": ").concat(count));
    });
    console.log('\n🔄 ALTERNATIVES:');
    console.log("Total Relationships: ".concat(analysis.alternativesBreakdown.totalRelationships));
    console.log("Open Source Tools: ".concat(analysis.alternativesBreakdown.openSourceTools));
    console.log("Proprietary Tools: ".concat(analysis.alternativesBreakdown.proprietaryTools));
    console.log('\n📂 CATEGORIES:');
    console.log("Total Categories: ".concat(analysis.categoriesBreakdown.total));
    console.log('Tools per Category:');
    Object.entries(analysis.categoriesBreakdown.toolsPerCategory)
        .sort(function (_a, _b) {
        var a = _a[1];
        var b = _b[1];
        return b - a;
    })
        .slice(0, 10)
        .forEach(function (_a) {
        var category = _a[0], count = _a[1];
        console.log("  ".concat(category, ": ").concat(count, " tools"));
    });
    console.log('\n⚙️ TECH STACKS:');
    console.log("Total Tech Stacks: ".concat(analysis.techStacksBreakdown.total));
    console.log('Most Used Stacks:');
    analysis.techStacksBreakdown.mostUsedStacks.forEach(function (stack) {
        console.log("  ".concat(stack.name, ": ").concat(stack.count, " tools"));
    });
    console.log('\n🚀 DEPLOYMENT OPTIONS:');
    console.log("Total Deployment Options: ".concat(analysis.deploymentOptionsBreakdown.total));
    console.log('Deployment Platforms:');
    Object.entries(analysis.deploymentOptionsBreakdown.optionCounts)
        .sort(function (_a, _b) {
        var a = _a[1];
        var b = _b[1];
        return b - a;
    })
        .forEach(function (_a) {
        var platform = _a[0], count = _a[1];
        console.log("  ".concat(platform, ": ").concat(count, " options"));
    });
    console.log('\n💡 RECOMMENDATIONS FOR TOOL PAGES:');
    console.log('1. Hero Section: Use name, description, logo, category, stars');
    console.log('2. Features Section: Group by featureType, show compatibility scores');
    console.log('3. Alternatives Section: Show both proprietary and open source alternatives');
    console.log('4. Tech Stack Section: Display associated technologies');
    console.log('5. Deployment Section: Show deployment options and types');
    console.log('6. Consider adding feature comparison tables');
    console.log('7. Add filtering by category and tech stack');
}
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var analysis, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    console.log('Analyzing tool data structure...\n');
                    return [4 /*yield*/, analyzeToolData()];
                case 1:
                    analysis = _a.sent();
                    displayAnalysis(analysis);
                    console.log('\n✅ Analysis complete!');
                    console.log('Ready to build individual tool pages with this data structure.');
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    console.error('❌ Analysis failed:', error_1);
                    process.exit(1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
if (require.main === module) {
    main();
}
