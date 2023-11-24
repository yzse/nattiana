"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "pages/api/openai";
exports.ids = ["pages/api/openai"];
exports.modules = {

/***/ "openai":
/*!*************************!*\
  !*** external "openai" ***!
  \*************************/
/***/ ((module) => {

module.exports = import("openai");;

/***/ }),

/***/ "(api)/./src/pages/api/openai.js":
/*!*********************************!*\
  !*** ./src/pages/api/openai.js ***!
  \*********************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ handler)\n/* harmony export */ });\n/* harmony import */ var openai__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! openai */ \"openai\");\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([openai__WEBPACK_IMPORTED_MODULE_0__]);\nopenai__WEBPACK_IMPORTED_MODULE_0__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];\n\nasync function handler(req, res) {\n    const openai = new openai__WEBPACK_IMPORTED_MODULE_0__[\"default\"]({\n        apiKey: \"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\"\n    });\n    const { base64Image } = req.body;\n    // api call\n    const response = await openai.chat.completions.create({\n        model: \"gpt-4-vision-preview\",\n        messages: [\n            {\n                role: \"system\",\n                content: \"Here's a photo of a wine label. Roast the person having this wine. Sound like a sassy sommelier in brooklyn, new york. Make it fun, maybe even a little rude, end with a haiku. Keep it about 500 characters\"\n            },\n            {\n                role: \"user\",\n                content: [\n                    {\n                        type: \"image_url\",\n                        image_url: {\n                            url: \"https://heartsbushwick.com/cdn/shop/products/image_81c027a4-6a42-4e2c-9a67-12a3e09ce295_3024x.jpg?v=1614552627\"\n                        }\n                    }\n                ]\n            }\n        ],\n        max_tokens: 4096\n    });\n    let formattedResponse = response.choices[0].message.content;\n    formattedResponse = formattedResponse.replace(/\\\"/g, \"\");\n    formattedResponse = formattedResponse.replace(/\\n/g, \" \");\n    formattedResponse = formattedResponse.replace(/\\\\/g, \"\");\n    // send response back to the client\n    res.status(200).json(formattedResponse);\n}\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwaSkvLi9zcmMvcGFnZXMvYXBpL29wZW5haS5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUE0QjtBQUViLGVBQWVDLFFBQVFDLEdBQUcsRUFBRUMsR0FBRztJQUMxQyxNQUFNQyxTQUFTLElBQUlKLDhDQUFNQSxDQUFDO1FBQUVLLFFBQVFDLHFEQUFzQ0U7SUFBQztJQUMzRSxNQUFNLEVBQUVDLFdBQVcsRUFBRSxHQUFHUCxJQUFJUTtJQUU1QixXQUFXO0lBQ1gsTUFBTUMsV0FBVyxNQUFNUCxPQUFPUSxLQUFLQyxZQUFZQyxPQUFPO1FBQ3REQyxPQUFPO1FBQ1BDLFVBQVU7WUFDTjtnQkFDQUMsTUFBTTtnQkFDTkMsU0FBUztZQUNUO1lBQ0E7Z0JBQ0FELE1BQU07Z0JBQ05DLFNBQVM7b0JBQ0w7d0JBQ0FDLE1BQU07d0JBQ05DLFdBQVc7NEJBQ1BDLEtBQUs7d0JBQ1Q7b0JBQ0E7aUJBQ0g7WUFDRDtTQUNIO1FBQ0RDLFlBQVk7SUFDWjtJQUVBLElBQUlDLG9CQUFvQlosU0FBU2EsT0FBTyxDQUFDLEVBQUUsQ0FBQ0MsUUFBUVA7SUFDcERLLG9CQUFvQkEsa0JBQWtCRyxRQUFRLE9BQU87SUFDckRILG9CQUFvQkEsa0JBQWtCRyxRQUFRLE9BQU87SUFDckRILG9CQUFvQkEsa0JBQWtCRyxRQUFRLE9BQU87SUFFckQsbUNBQW1DO0lBQ25DdkIsSUFBSXdCLE9BQU8sS0FBS0MsS0FBS0w7QUFDekIiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9uYXR0aWFuYS8uL3NyYy9wYWdlcy9hcGkvb3BlbmFpLmpzP2E4ZjEiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IE9wZW5BSSBmcm9tICdvcGVuYWknO1xuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBoYW5kbGVyKHJlcSwgcmVzKSB7XG4gICAgY29uc3Qgb3BlbmFpID0gbmV3IE9wZW5BSSh7IGFwaUtleTogcHJvY2Vzcy5lbnYuTkVYVF9QVUJMSUNfT1BFTkFJX0FQSV9LRVkgfSk7XG4gICAgY29uc3QgeyBiYXNlNjRJbWFnZSB9ID0gcmVxLmJvZHk7XG5cbiAgICAvLyBhcGkgY2FsbFxuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgb3BlbmFpLmNoYXQuY29tcGxldGlvbnMuY3JlYXRlKHtcbiAgICBtb2RlbDogXCJncHQtNC12aXNpb24tcHJldmlld1wiLFxuICAgIG1lc3NhZ2VzOiBbXG4gICAgICAgIHtcbiAgICAgICAgcm9sZTogXCJzeXN0ZW1cIixcbiAgICAgICAgY29udGVudDogXCJIZXJlJ3MgYSBwaG90byBvZiBhIHdpbmUgbGFiZWwuIFJvYXN0IHRoZSBwZXJzb24gaGF2aW5nIHRoaXMgd2luZS4gU291bmQgbGlrZSBhIHNhc3N5IHNvbW1lbGllciBpbiBicm9va2x5biwgbmV3IHlvcmsuIE1ha2UgaXQgZnVuLCBtYXliZSBldmVuIGEgbGl0dGxlIHJ1ZGUsIGVuZCB3aXRoIGEgaGFpa3UuIEtlZXAgaXQgYWJvdXQgNTAwIGNoYXJhY3RlcnNcIixcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICByb2xlOiBcInVzZXJcIixcbiAgICAgICAgY29udGVudDogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgdHlwZTogXCJpbWFnZV91cmxcIixcbiAgICAgICAgICAgIGltYWdlX3VybDoge1xuICAgICAgICAgICAgICAgIHVybDogXCJodHRwczovL2hlYXJ0c2J1c2h3aWNrLmNvbS9jZG4vc2hvcC9wcm9kdWN0cy9pbWFnZV84MWMwMjdhNC02YTQyLTRlMmMtOWE2Ny0xMmEzZTA5Y2UyOTVfMzAyNHguanBnP3Y9MTYxNDU1MjYyN1wiLFxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICAgIH0sXG4gICAgXSxcbiAgICBtYXhfdG9rZW5zOiA0MDk2LFxuICAgIH0pO1xuXG4gICAgbGV0IGZvcm1hdHRlZFJlc3BvbnNlID0gcmVzcG9uc2UuY2hvaWNlc1swXS5tZXNzYWdlLmNvbnRlbnQ7XG4gICAgZm9ybWF0dGVkUmVzcG9uc2UgPSBmb3JtYXR0ZWRSZXNwb25zZS5yZXBsYWNlKC9cXFwiL2csIFwiXCIpO1xuICAgIGZvcm1hdHRlZFJlc3BvbnNlID0gZm9ybWF0dGVkUmVzcG9uc2UucmVwbGFjZSgvXFxuL2csIFwiIFwiKTtcbiAgICBmb3JtYXR0ZWRSZXNwb25zZSA9IGZvcm1hdHRlZFJlc3BvbnNlLnJlcGxhY2UoL1xcXFwvZywgXCJcIik7XG5cbiAgICAvLyBzZW5kIHJlc3BvbnNlIGJhY2sgdG8gdGhlIGNsaWVudFxuICAgIHJlcy5zdGF0dXMoMjAwKS5qc29uKGZvcm1hdHRlZFJlc3BvbnNlKTtcbn0iXSwibmFtZXMiOlsiT3BlbkFJIiwiaGFuZGxlciIsInJlcSIsInJlcyIsIm9wZW5haSIsImFwaUtleSIsInByb2Nlc3MiLCJlbnYiLCJORVhUX1BVQkxJQ19PUEVOQUlfQVBJX0tFWSIsImJhc2U2NEltYWdlIiwiYm9keSIsInJlc3BvbnNlIiwiY2hhdCIsImNvbXBsZXRpb25zIiwiY3JlYXRlIiwibW9kZWwiLCJtZXNzYWdlcyIsInJvbGUiLCJjb250ZW50IiwidHlwZSIsImltYWdlX3VybCIsInVybCIsIm1heF90b2tlbnMiLCJmb3JtYXR0ZWRSZXNwb25zZSIsImNob2ljZXMiLCJtZXNzYWdlIiwicmVwbGFjZSIsInN0YXR1cyIsImpzb24iXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(api)/./src/pages/api/openai.js\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../webpack-api-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__("(api)/./src/pages/api/openai.js"));
module.exports = __webpack_exports__;

})();