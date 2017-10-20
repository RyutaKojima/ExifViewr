/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _config = __webpack_require__(1);

var _config2 = _interopRequireDefault(_config);

var _exif_util = __webpack_require__(2);

var _exif_util2 = _interopRequireDefault(_exif_util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

$(function () {
	var windowURL = window.URL || window.webkitURL;
	var exifUtil = new _exif_util2.default(_config2.default.FieldName, _config2.default.valueFormat);

	if (!window.FileReader) {
		window.alert("File API がサポートされていません。");
		return false;
	}

	var cancelEvent = function cancelEvent(event) {
		event.preventDefault();
		event.stopPropagation();
		return false;
	};

	var analyzeExif = function analyzeExif(file, $infoBox, $imageBox) {
		$infoBox.text("解析中...");
		$imageBox.empty();

		if (!file) {
			$infoBox.text("ファイルが読み込めませんでした。");
			return;
		}

		if (!_exif_util2.default.isSupport(file.type)) {
			$infoBox.text("サポートされていない形式です。");
			return;
		}

		EXIF.getData(file, function () {
			var exif = EXIF.getAllTags(this);
			if (Object.keys(exif).length === 0) {
				$infoBox.text("Exif情報がありません。");
				return;
			}

			var $table = $("<table>");
			for (var key in exif) {
				if (!exif.hasOwnProperty(key)) {
					continue;
				}

				var $tr = $("<tr>");
				$tr.append($("<td>").addClass("exifHeader").text(exifUtil.getFieldNameLabel(key)));
				$tr.append($("<td>").addClass("exifValue").text(exifUtil.getExifValueLabel(key, exif[key])));
				$table.append($tr);
			}
			$infoBox.empty().append($table);
		});

		var img = new Image();
		img.alt = file.name;
		img.title = file.name;
		img.src = windowURL.createObjectURL(file);
		img.onload = function () {
			windowURL.revokeObjectURL(this.src);
			$imageBox.append(this);
		};
	};

	$("body").bind("dragenter", function (event) {
		$("#dropArea").addClass("dropping");
		$("#overlay").show();
		return cancelEvent(event);
	}).bind("dragover", cancelEvent).bind("drop", function (event) {
		$("#exifInfo").empty();
		$('#previewArea').empty();

		$("#dropArea").removeClass("dropping");
		$("#overlay").hide();
		return cancelEvent(event);
	});

	$("#dropArea").bind("drop", function (event) {
		// ファイルは複数ドロップされる可能性がありますが, 1 つ目のファイルだけ扱います.
		var file = event.originalEvent.dataTransfer.files[0];

		analyzeExif(file, $("#exifInfo"), $('#previewArea'));

		$("#dropArea").removeClass("dropping");
		$("#overlay").hide();
		return cancelEvent(event);
	});
});

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = {
	valueFormat: {
		Orientation: {
			type: "replace",
			label: {
				1: "そのまま",
				2: "上下反転(上下鏡像?)",
				3: "180度回転",
				4: "左右反転",
				5: "上下反転、時計周りに270度(反時計回りに90度)回転",
				6: "時計周りに90度回転",
				7: "上下反転、時計周りに90度回転",
				8: "時計周りに270度(反時計回りに90度)回転"
			}
		},
		ResolutionUnit: {
			type: "replace",
			label: {
				2: "インチ",
				3: "センチメートル"
			}
		},
		FocalLength: {
			type: "suffix",
			label: "mm"
		}
	},
	FieldName: {
		// TIFF
		ImageWidth: "画像の幅",
		ImageLength: "画像の高さ",
		BitsPerSample: "画像のビットの深さ",
		Compression: "圧縮の種類",
		PhotometricInterpretation: "画素構成",
		ImageDescription: "画像タイトル",
		Make: "画像入力機器のメーカー名",
		Model: "画像入力機器のモデル名",
		StripOffsets: "画像データのロケーション",
		Orientation: "画像方向",
		SamplesPerPixel: "コンポーネント数",
		RowsPerStrip: "1ストリップあたりの行の数",
		StripByteCounts: "ストリップの総バイト数",
		XResolution: "画像の幅の解像度",
		YResolution: "画像の高さの解像度",
		PlanarConfiguration: "画像データの並び",
		ResolutionUnit: "画像の幅と高さの解像度の単位",
		TransferFunction: "再生階調カーブ特性",
		Software: "ソフトウェア",
		DateTime: "ファイル変更日時",
		Artist: "アーティスト",
		WhitePoint: "参照白色点の色度座標値",
		PrimaryChromaticities: "原色の色度座標値",
		JPEGInterchangeFormat: "JPEGのSOIへのオフセット",
		JPEGInterchangeFormatLength: "JPEGデータのバイト数",
		YCbCrCoefficients: "色変換マトリクス係数",
		YCbCrSubSampling: "YCCの画素構成(Cの間引き率)",
		YCbCrPositioning: "YCCの画素構成(YとCの位置)",
		ReferenceBlackWhite: "参照黒色点値と参照白色点値",
		Copyright: "撮影著作権者/編集著作権者",
		ExifIFDPointer: "Exifタグ",
		GPSInfoIFDPointer: "GPSタグ",
		// Exif
		ExposureTime: "露出時間",
		FNumber: "Fナンバー",
		ExposureProgram: "露出プログラム",
		SpectralSensitivity: "スペクトル感度",
		PhotographicSensitivity: "撮影感度",
		OECF: "光電変換関数",
		SensitivityType: "感度種別",
		StandardOutputSensitivity: "標準出力感度",
		RecommendedExposureIndex: "推奨露光指数",
		ISOSpeed: "ISOスピード",
		ISOSpeedLatitudeyyy: "ISOスピードラチチュードyyy",
		ISOSpeedLatitudezzz: "ISOスピードラチチュードzzz",
		ExifVersion: "Exifバージョン",
		DateTimeOriginal: "原画像データの生成日時",
		DateTimeDigitized: "デジタルデータの作成日時",
		ComponentsConfiguration: "各コンポーネントの意味",
		CompressedBitsPerPixel: "画像圧縮モード",
		ShutterSpeedValue: "シャッタースピード",
		ApertureValue: "絞り値",
		BrightnessValue: "輝度値",
		ExposureBiasValue: "露光補正値",
		MaxApertureValue: "レンズ最小Ｆ値",
		SubjectDistance: "被写体距離",
		MeteringMode: "測光方式",
		LightSource: "光源",
		Flash: "フラッシュ",
		FocalLength: "レンズ焦点距離",
		SubjectArea: "被写体領域",
		MakerNote: "メーカノート",
		UserComment: "ユーザコメント",
		SubSecTime: "DateTimeのサブセック",
		SubSecTimeOriginal: "DateTimeOriginalのサブセック",
		SubSecTimeDigitized: "DateTimeDigitizedのサブセック",
		FlashpixVersion: "対応フラッシュピックスバージョン",
		ColorSpace: "色空間情報",
		PixelXDimension: "実効画像幅",
		PixelYDimension: "実効画像高さ",
		RelatedSoundFile: "関連音声ファイル",
		InteroperabilityIFDPointer: "互換性IFDへのポインタ",
		FlashEnergy: "フラッシュ強度",
		SpatialFrequencyResponse: "空間周波数応答",
		FocalPlaneXResolution: "焦点面の幅の解像度",
		FocalPlaneYResolution: "焦点面の高さの解像度",
		FocalPlaneResolutionUnit: "焦点面解像度単位",
		SubjectLocation: "被写体位置",
		ExposureIndex: "露出インデックス",
		SensingMethod: "センサ方式",
		FileSource: "ファイルソース",
		SceneType: "シーンタイプ",
		CFAPattern: "CFAパターン",
		CustomRendered: "個別画像処理",
		ExposureMode: "露出モード",
		WhiteBalance: "ホワイトバランス",
		DigitalZoomRatio: "デジタルズーム倍率",
		FocalLengthIn35mmFilm: "35mm換算レンズ焦点距離",
		SceneCaptureType: "撮影シーンタイプ",
		GainControl: "ゲイン制御",
		Contrast: "撮影コントラスト",
		Saturation: "撮影彩度",
		Sharpness: "撮影シャープネス",
		DeviceSettingDescription: "撮影条件記述情報",
		SubjectDistanceRange: "被写体距離レンジ",
		ImageUniqueID: "画像ユニークID",
		CameraOwnerName: "カメラ所有者名",
		BodySerialNumber: "カメラシリアル番号",
		LensSpecification: "レンズの仕様情報",
		LensMake: "レンズのメーカ名",
		LensModel: "レンズのモデル名",
		LensSerialNumber: "レンズシリアル番号",
		Gamma: "再生ガンマ",
		// GPS
		GPSVersionID: "GPSタグのバージョン",
		GPSLatitudeRef: "北緯(N) or 南緯(S)",
		GPSLatitude: "緯度(数値)",
		GPSLongitudeRef: "東経(E) or 西経(W)",
		GPSLongitude: "経度(数値)",
		GPSAltitudeRef: "高度の基準",
		GPSAltitude: "高度(数値)",
		GPSTimeStamp: "GPS時間(原子時計の時間)",
		GPSSatellites: "測位に使った衛星信号",
		GPSStatus: "GPS受信機の状態",
		GPSMeasureMode: "GPSの測位方法",
		GPSDOP: "測位の信頼性",
		GPSSpeedRef: "速度の単位",
		GPSSpeed: "速度(数値)",
		GPSTrackRef: "進行方向の単位",
		GPSTrack: "進行方向(数値)",
		GPSImgDirectionRef: "撮影した画像の方向の単位",
		GPSImgDirection: "撮影した画像の方向(数値)",
		GPSMapDatum: "測位に用いた地図データ",
		GPSDestLatitudeRef: "目的地の北緯(N) or 南緯(S)",
		GPSDestLatitude: "目的地の緯度(数値)",
		GPSDestLongitudeRef: "目的地の東経(E) or 西経(W)",
		GPSDestLongitude: "目的地の経度(数値)",
		GPSDestBearingRef: "目的地の方角の単位",
		GPSDestBearing: "目的の方角(数値)",
		GPSDestDistanceRef: "目的地までの距離の単位",
		GPSDestDistance: "目的地までの距離(数値)",
		GPSProcessingMethod: "測位方式の名称",
		GPSAreaInformation: "測位地点の名称",
		GPSDateStamp: "GPS日付",
		GPSDifferential: "GPS補正測位",
		GPSHPositioningError: "水平方向測位誤差"
	}
};

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ExifUtil = function () {
	function ExifUtil(configFieldName, configValueFormat) {
		_classCallCheck(this, ExifUtil);

		this.FieldName = configFieldName;
		this.ValueFormat = configValueFormat;
	}

	_createClass(ExifUtil, [{
		key: 'getFieldNameLabel',
		value: function getFieldNameLabel(key) {
			return this.FieldName.hasOwnProperty(key) ? this.FieldName[key] : key;
		}
	}, {
		key: 'getExifValueLabel',
		value: function getExifValueLabel(key, value) {
			if (!this.ValueFormat.hasOwnProperty(key)) {
				return value;
			}

			var fomatType = this.ValueFormat[key].type;
			var fomatLabel = this.ValueFormat[key].label;
			switch (fomatType) {
				case "replace":
					if (fomatLabel.hasOwnProperty(value)) {
						value = fomatLabel[value];
					}
					break;
				case "prefix":
					value = fomatLabel + value;
					break;
				case "suffix":
					value += fomatLabel;
					break;
			}

			return value;
		}
	}], [{
		key: 'isSupport',
		value: function isSupport(mimeType) {
			var SUPPORT_FILE_TYPE = ['image/jpeg', 'image/tiff'];
			return SUPPORT_FILE_TYPE.indexOf(mimeType) !== -1;
		}
	}]);

	return ExifUtil;
}();

exports.default = ExifUtil;

/***/ })
/******/ ]);