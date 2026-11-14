/**
 * results.js — Municipal Data Packaging Utilities (standalone)
 *
 * This module can be loaded independently of app.js for unit-testing
 * the payload structure. In production, app.js handles rendering and
 * calls buildMunicipalPayload() internally — this file exists as a
 * reference and for any external integrations that need to construct
 * or validate payloads independently.
 *
 * The canonical payload builder lives in app.js (buildMunicipalPayload).
 * This file documents the JSON schema contract.
 */

/*
 * Municipal Data Payload Schema v1.0.0
 * =====================================
 *
 * {
 *   "schema_version": "1.0.0",
 *   "submission_type": "residential_service_line_identification",
 *
 *   "municipality": {
 *     "name": "Baltimore Housing & Community Development",
 *     "jurisdiction": "Baltimore City, MD",
 *     "program": "Lead Service Line Inventory (LCRR Compliance)"
 *   },
 *
 *   "resident": {
 *     "name": "string",
 *     "address": "string"
 *   },
 *
 *   "identification": {
 *     "material": "galvanized_steel | lead | copper",
 *     "material_label": "string",
 *     "is_magnetic": "boolean",
 *     "confidence_score": "number (0.0 – 1.0)",
 *     "detection_method": "motion_sensor | camera_analysis | demo_override",
 *     "health_risk_level": "Low | Moderate | High"
 *   },
 *
 *   "geolocation": {
 *     "latitude": "number",
 *     "longitude": "number",
 *     "accuracy_meters": "number | null",
 *     "source": "string"
 *   },
 *
 *   "timestamp_utc": "ISO 8601 string",
 *
 *   "device": {
 *     "user_agent": "string",
 *     "platform": "string"
 *   }
 * }
 */

// No runtime exports needed — schema documentation only.
// All payload construction is handled by app.js:buildMunicipalPayload().
