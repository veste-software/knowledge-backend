import type { Schema, Attribute } from '@strapi/strapi';

export interface EmbellishedCopyrightEvidenceEmbellishedCopyrightEvidence
  extends Schema.Component {
  collectionName: 'components_embellished_copyright_evidence_embellished_copyright_evidences';
  info: {
    displayName: 'Embellished Copyright Evidence';
    icon: 'bulletList';
    description: '';
  };
  attributes: {
    CE_Title: Attribute.String & Attribute.DefaultTo<'CE_Title'>;
    CE_Authors: Attribute.String;
    paperId: Attribute.String;
    corpusId: Attribute.String;
    url: Attribute.String;
    title: Attribute.String;
    abstract: Attribute.RichText;
    venue: Attribute.String;
    year: Attribute.Integer;
    referenceCount: Attribute.Integer;
    citationCount: Attribute.Integer;
    influentialCitationCount: Attribute.Integer;
    openAccessPdf: Attribute.String;
    fieldsOfStudy: Attribute.String;
    publicationDate: Attribute.Date;
    journal: Attribute.JSON;
    citationStyles: Attribute.JSON;
    authors: Attribute.JSON;
    externalIds: Attribute.JSON;
    s2FieldsOfStudy: Attribute.JSON;
    publicationTypes: Attribute.JSON;
  };
}

export interface ScrapersScrapers extends Schema.Component {
  collectionName: 'components_scrapers_scrapers';
  info: {
    displayName: 'Scrapers';
    icon: 'server';
  };
  attributes: {
    ScraperIdentifier: Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export module Shared {
    export interface Components {
      'embellished-copyright-evidence.embellished-copyright-evidence': EmbellishedCopyrightEvidenceEmbellishedCopyrightEvidence;
      'scrapers.scrapers': ScrapersScrapers;
    }
  }
}
