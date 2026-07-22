-- Cache of Amazon Translate results so identical text is never paid for twice.
-- cache_key = sha256(sourceText) + ':' + targetLang
CREATE TABLE translation_cache (
    cache_key       VARCHAR(80) PRIMARY KEY,
    translated_text TEXT NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
