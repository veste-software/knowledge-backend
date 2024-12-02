import type { Schema, Struct } from '@strapi/strapi';

export interface EmbellishedCopyrightEvidenceEmbellishedCopyrightEvidence
  extends Struct.ComponentSchema {
  collectionName: 'components_embellished_copyright_evidence_embellished_copyright_evidences';
  info: {
    description: '';
    displayName: 'Embellished Copyright Evidence';
    icon: 'bulletList';
  };
  attributes: {
    abstract: Schema.Attribute.RichText;
    authors: Schema.Attribute.JSON;
    CE_Authors: Schema.Attribute.String;
    CE_Title: Schema.Attribute.String & Schema.Attribute.DefaultTo<'CE_Title'>;
    citationCount: Schema.Attribute.Integer;
    citationStyles: Schema.Attribute.JSON;
    corpusId: Schema.Attribute.String;
    externalIds: Schema.Attribute.JSON;
    fieldsOfStudy: Schema.Attribute.String;
    influentialCitationCount: Schema.Attribute.Integer;
    journal: Schema.Attribute.JSON;
    openAccessPdf: Schema.Attribute.String;
    paperId: Schema.Attribute.String;
    publicationDate: Schema.Attribute.Date;
    publicationTypes: Schema.Attribute.JSON;
    referenceCount: Schema.Attribute.Integer;
    s2FieldsOfStudy: Schema.Attribute.JSON;
    title: Schema.Attribute.String;
    url: Schema.Attribute.String;
    venue: Schema.Attribute.String;
    year: Schema.Attribute.Integer;
  };
}

export interface ScrapersScrapers extends Struct.ComponentSchema {
  collectionName: 'components_scrapers_scrapers';
  info: {
    displayName: 'Scrapers';
    icon: 'server';
  };
  attributes: {
    ScraperIdentifier: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'embellished-copyright-evidence.embellished-copyright-evidence': EmbellishedCopyrightEvidenceEmbellishedCopyrightEvidence;
      'scrapers.scrapers': ScrapersScrapers;
    }
  }
}
