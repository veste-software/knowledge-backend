import type { Schema, Attribute } from '@strapi/strapi';

export interface AdminPermission extends Schema.CollectionType {
  collectionName: 'admin_permissions';
  info: {
    name: 'Permission';
    description: '';
    singularName: 'permission';
    pluralName: 'permissions';
    displayName: 'Permission';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    subject: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    properties: Attribute.JSON & Attribute.DefaultTo<{}>;
    conditions: Attribute.JSON & Attribute.DefaultTo<[]>;
    role: Attribute.Relation<'admin::permission', 'manyToOne', 'admin::role'>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'admin::permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'admin::permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface AdminUser extends Schema.CollectionType {
  collectionName: 'admin_users';
  info: {
    name: 'User';
    description: '';
    singularName: 'user';
    pluralName: 'users';
    displayName: 'User';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    firstname: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    lastname: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    username: Attribute.String;
    email: Attribute.Email &
      Attribute.Required &
      Attribute.Private &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    password: Attribute.Password &
      Attribute.Private &
      Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    resetPasswordToken: Attribute.String & Attribute.Private;
    registrationToken: Attribute.String & Attribute.Private;
    isActive: Attribute.Boolean &
      Attribute.Private &
      Attribute.DefaultTo<false>;
    roles: Attribute.Relation<'admin::user', 'manyToMany', 'admin::role'> &
      Attribute.Private;
    blocked: Attribute.Boolean & Attribute.Private & Attribute.DefaultTo<false>;
    preferedLanguage: Attribute.String;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<'admin::user', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    updatedBy: Attribute.Relation<'admin::user', 'oneToOne', 'admin::user'> &
      Attribute.Private;
  };
}

export interface AdminRole extends Schema.CollectionType {
  collectionName: 'admin_roles';
  info: {
    name: 'Role';
    description: '';
    singularName: 'role';
    pluralName: 'roles';
    displayName: 'Role';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    code: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    description: Attribute.String;
    users: Attribute.Relation<'admin::role', 'manyToMany', 'admin::user'>;
    permissions: Attribute.Relation<
      'admin::role',
      'oneToMany',
      'admin::permission'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<'admin::role', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    updatedBy: Attribute.Relation<'admin::role', 'oneToOne', 'admin::user'> &
      Attribute.Private;
  };
}

export interface AdminApiToken extends Schema.CollectionType {
  collectionName: 'strapi_api_tokens';
  info: {
    name: 'Api Token';
    singularName: 'api-token';
    pluralName: 'api-tokens';
    displayName: 'Api Token';
    description: '';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    description: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }> &
      Attribute.DefaultTo<''>;
    type: Attribute.Enumeration<['read-only', 'full-access', 'custom']> &
      Attribute.Required &
      Attribute.DefaultTo<'read-only'>;
    accessKey: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    lastUsedAt: Attribute.DateTime;
    permissions: Attribute.Relation<
      'admin::api-token',
      'oneToMany',
      'admin::api-token-permission'
    >;
    expiresAt: Attribute.DateTime;
    lifespan: Attribute.BigInteger;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'admin::api-token',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'admin::api-token',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface AdminApiTokenPermission extends Schema.CollectionType {
  collectionName: 'strapi_api_token_permissions';
  info: {
    name: 'API Token Permission';
    description: '';
    singularName: 'api-token-permission';
    pluralName: 'api-token-permissions';
    displayName: 'API Token Permission';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    token: Attribute.Relation<
      'admin::api-token-permission',
      'manyToOne',
      'admin::api-token'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'admin::api-token-permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'admin::api-token-permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface AdminTransferToken extends Schema.CollectionType {
  collectionName: 'strapi_transfer_tokens';
  info: {
    name: 'Transfer Token';
    singularName: 'transfer-token';
    pluralName: 'transfer-tokens';
    displayName: 'Transfer Token';
    description: '';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    description: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }> &
      Attribute.DefaultTo<''>;
    accessKey: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    lastUsedAt: Attribute.DateTime;
    permissions: Attribute.Relation<
      'admin::transfer-token',
      'oneToMany',
      'admin::transfer-token-permission'
    >;
    expiresAt: Attribute.DateTime;
    lifespan: Attribute.BigInteger;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'admin::transfer-token',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'admin::transfer-token',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface AdminTransferTokenPermission extends Schema.CollectionType {
  collectionName: 'strapi_transfer_token_permissions';
  info: {
    name: 'Transfer Token Permission';
    description: '';
    singularName: 'transfer-token-permission';
    pluralName: 'transfer-token-permissions';
    displayName: 'Transfer Token Permission';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    token: Attribute.Relation<
      'admin::transfer-token-permission',
      'manyToOne',
      'admin::transfer-token'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'admin::transfer-token-permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'admin::transfer-token-permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginUploadFile extends Schema.CollectionType {
  collectionName: 'files';
  info: {
    singularName: 'file';
    pluralName: 'files';
    displayName: 'File';
    description: '';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String & Attribute.Required;
    alternativeText: Attribute.String;
    caption: Attribute.String;
    width: Attribute.Integer;
    height: Attribute.Integer;
    formats: Attribute.JSON;
    hash: Attribute.String & Attribute.Required;
    ext: Attribute.String;
    mime: Attribute.String & Attribute.Required;
    size: Attribute.Decimal & Attribute.Required;
    url: Attribute.String & Attribute.Required;
    previewUrl: Attribute.String;
    provider: Attribute.String & Attribute.Required;
    provider_metadata: Attribute.JSON;
    related: Attribute.Relation<'plugin::upload.file', 'morphToMany'>;
    folder: Attribute.Relation<
      'plugin::upload.file',
      'manyToOne',
      'plugin::upload.folder'
    > &
      Attribute.Private;
    folderPath: Attribute.String &
      Attribute.Required &
      Attribute.Private &
      Attribute.SetMinMax<{
        min: 1;
      }>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::upload.file',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::upload.file',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginUploadFolder extends Schema.CollectionType {
  collectionName: 'upload_folders';
  info: {
    singularName: 'folder';
    pluralName: 'folders';
    displayName: 'Folder';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMax<{
        min: 1;
      }>;
    pathId: Attribute.Integer & Attribute.Required & Attribute.Unique;
    parent: Attribute.Relation<
      'plugin::upload.folder',
      'manyToOne',
      'plugin::upload.folder'
    >;
    children: Attribute.Relation<
      'plugin::upload.folder',
      'oneToMany',
      'plugin::upload.folder'
    >;
    files: Attribute.Relation<
      'plugin::upload.folder',
      'oneToMany',
      'plugin::upload.file'
    >;
    path: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMax<{
        min: 1;
      }>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::upload.folder',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::upload.folder',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginCronCronJob extends Schema.CollectionType {
  collectionName: 'cron_jobs';
  info: {
    singularName: 'cron-job';
    pluralName: 'cron-jobs';
    displayName: 'Cron Job';
  };
  options: {
    draftAndPublish: true;
    comment: '';
  };
  pluginOptions: {
    'content-manager': {
      visible: true;
    };
    'content-type-builder': {
      visible: true;
    };
  };
  attributes: {
    name: Attribute.String & Attribute.Required & Attribute.Unique;
    schedule: Attribute.String & Attribute.Required;
    executeScriptFromFile: Attribute.Boolean & Attribute.DefaultTo<true>;
    pathToScript: Attribute.String;
    script: Attribute.Text;
    iterationsLimit: Attribute.Integer &
      Attribute.SetMinMax<{
        min: -1;
      }> &
      Attribute.DefaultTo<-1>;
    iterationsCount: Attribute.Integer & Attribute.DefaultTo<0>;
    startDate: Attribute.DateTime;
    endDate: Attribute.DateTime;
    latestExecutionLog: Attribute.JSON;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::cron.cron-job',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::cron.cron-job',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginI18NLocale extends Schema.CollectionType {
  collectionName: 'i18n_locale';
  info: {
    singularName: 'locale';
    pluralName: 'locales';
    collectionName: 'locales';
    displayName: 'Locale';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String &
      Attribute.SetMinMax<{
        min: 1;
        max: 50;
      }>;
    code: Attribute.String & Attribute.Unique;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::i18n.locale',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::i18n.locale',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginUsersPermissionsPermission
  extends Schema.CollectionType {
  collectionName: 'up_permissions';
  info: {
    name: 'permission';
    description: '';
    singularName: 'permission';
    pluralName: 'permissions';
    displayName: 'Permission';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Attribute.String & Attribute.Required;
    role: Attribute.Relation<
      'plugin::users-permissions.permission',
      'manyToOne',
      'plugin::users-permissions.role'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::users-permissions.permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::users-permissions.permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginUsersPermissionsRole extends Schema.CollectionType {
  collectionName: 'up_roles';
  info: {
    name: 'role';
    description: '';
    singularName: 'role';
    pluralName: 'roles';
    displayName: 'Role';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 3;
      }>;
    description: Attribute.String;
    type: Attribute.String & Attribute.Unique;
    permissions: Attribute.Relation<
      'plugin::users-permissions.role',
      'oneToMany',
      'plugin::users-permissions.permission'
    >;
    users: Attribute.Relation<
      'plugin::users-permissions.role',
      'oneToMany',
      'plugin::users-permissions.user'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::users-permissions.role',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::users-permissions.role',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginUsersPermissionsUser extends Schema.CollectionType {
  collectionName: 'up_users';
  info: {
    name: 'user';
    description: '';
    singularName: 'user';
    pluralName: 'users';
    displayName: 'User';
  };
  options: {
    draftAndPublish: false;
    timestamps: true;
  };
  attributes: {
    username: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 3;
      }>;
    email: Attribute.Email &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    provider: Attribute.String;
    password: Attribute.Password &
      Attribute.Private &
      Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    resetPasswordToken: Attribute.String & Attribute.Private;
    confirmationToken: Attribute.String & Attribute.Private;
    confirmed: Attribute.Boolean & Attribute.DefaultTo<false>;
    blocked: Attribute.Boolean & Attribute.DefaultTo<false>;
    role: Attribute.Relation<
      'plugin::users-permissions.user',
      'manyToOne',
      'plugin::users-permissions.role'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::users-permissions.user',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::users-permissions.user',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginGraphsBuilderGraph extends Schema.CollectionType {
  collectionName: 'graphs_builder_graph';
  info: {
    name: 'graph';
    description: '';
    singularName: 'graph';
    pluralName: 'graphs';
    displayName: 'Graph';
  };
  options: {
    draftAndPublish: false;
    timestamps: true;
  };
  pluginOptions: {
    'content-manager': {
      visible: true;
    };
    'content-type-builder': {
      visible: true;
    };
  };
  attributes: {
    title: Attribute.String & Attribute.Required;
    type: Attribute.Enumeration<['pie', 'bar', 'line', 'dateLine']> &
      Attribute.Required;
    collectionX: Attribute.String & Attribute.Required;
    collectionXAttribute: Attribute.String;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::graphs-builder.graph',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::graphs-builder.graph',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiCopyrightFlexibilitiesCopyrightFlexibilities
  extends Schema.CollectionType {
  collectionName: 'copyright_flexibilitiess';
  info: {
    singularName: 'copyright-flexibilities';
    pluralName: 'copyright-flexibilitiess';
    displayName: 'Copyright Flexibilities';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    cf_id: Attribute.UID;
    flexibility_category: Attribute.Enumeration<
      [
        'Temporary, de minimis and lawful uses',
        'Private copy and reprography',
        'Freedom of expression',
        'Uses for teaching and research purposes',
        'Uses for information purposes',
        'Uses by public authorities',
        'Socially oriented uses',
        'Cultural uses (access, preservation, reuse)',
        'Flexibilities for persons with disabilities',
        'Other non-infringing uses',
        'Three-step-test',
        'Public domain',
        'External copyright flexibilities',
        'Quotation',
        'Parody, caricature, pastiche',
        'Special licensing schemes (compulsory, statutory, ECL)'
      ]
    > &
      Attribute.DefaultTo<'Uses by public authorities'>;
    flexibility_subcategory: Attribute.Text & Attribute.DefaultTo<''>;
    legal_text: Attribute.Text & Attribute.DefaultTo<'Not implemented.'>;
    notes_on_legal_text: Attribute.Text;
    legal_provision: Attribute.Text & Attribute.DefaultTo<'Not implemented.'>;
    notes_on_legal_provision: Attribute.Text;
    rights_or_uses_covered: Attribute.Text &
      Attribute.DefaultTo<'Uses in administrative and judicial proceedings'>;
    country: Attribute.Enumeration<
      [
        'Austria',
        'Belgium',
        'Bulgaria',
        'Croatia',
        'Cyprus',
        'Czechia',
        'Denmark',
        'Estonia',
        'Finland',
        'France',
        'Germany',
        'Greece',
        'Ireland',
        'Italy',
        'Latvia',
        'Lithuania',
        'Luxembourg',
        'Malta',
        'Netherlands',
        'Poland',
        'Portugal',
        'Romania',
        'Slovakia',
        'Slovenia',
        'Spain',
        'Sweden',
        'Hungary'
      ]
    > &
      Attribute.DefaultTo<'Austria'>;
    notes_on_statutory_reference: Attribute.Text;
    specificities_in_implementation: Attribute.Text;
    entry_into_force: Attribute.String & Attribute.DefaultTo<'n/a'>;
    notes_on_entry_into_force: Attribute.Text;
    eu_source: Attribute.Text & Attribute.DefaultTo<'Article 9(c) Database'>;
    notes_on_eu_source: Attribute.Text;
    eu_provision: Attribute.Text & Attribute.DefaultTo<'Article 9(c) Database'>;
    notes_on_eu_provision: Attribute.Text;
    related_eu_provision: Attribute.Text &
      Attribute.DefaultTo<'Article 9(c) Database'>;
    notes_on_related_eu_provision: Attribute.Text;
    legal_text_in_english: Attribute.Text & Attribute.DefaultTo<'n/a'>;
    notes_on_legal_text_in_english: Attribute.Text;
    beneficiaries: Attribute.Text & Attribute.DefaultTo<'n/a'>;
    notes_on_beneficiaries: Attribute.Text;
    beneficiaries_score: Attribute.Enumeration<
      ['n-5', 'n-4', 'n-3', 'n-2', 'n-1', 'n0', 'n1', 'n2', 'n3', 'n4', 'n5']
    >;
    subject_matter: Attribute.Text & Attribute.DefaultTo<'n/a'>;
    notes_on_subject_matter: Attribute.Text;
    subject_matter_score: Attribute.Enumeration<
      ['n-5', 'n-4', 'n-3', 'n-2', 'n-1', 'n0', 'n1', 'n2', 'n3', 'n4', 'n5']
    >;
    rights_or_uses_covered_score: Attribute.Enumeration<
      ['n-5', 'n-4', 'n-3', 'n-2', 'n-1', 'n0', 'n1', 'n2', 'n3', 'n4', 'n5']
    >;
    purpose_of_the_use: Attribute.Text & Attribute.DefaultTo<'n/a'>;
    notes_on_purpose_of_the_use: Attribute.Text;
    purpose_of_the_use_score: Attribute.Enumeration<
      ['n-5', 'n-4', 'n-3', 'n-2', 'n-1', 'n0', 'n1', 'n2', 'n3', 'n4', 'n5']
    >;
    remuneration: Attribute.Boolean & Attribute.DefaultTo<true>;
    notes_on_remuneration: Attribute.Text;
    remuneration_score: Attribute.Enumeration<
      ['n-5', 'n-4', 'n-3', 'n-2', 'n-1', 'n0', 'n1', 'n2', 'n3', 'n4', 'n5']
    >;
    attribution: Attribute.Boolean & Attribute.DefaultTo<true>;
    notes_on_attribution: Attribute.Text;
    attribution_score: Attribute.Enumeration<
      ['n-5', 'n-4', 'n-3', 'n-2', 'n-1', 'n0', 'n1', 'n2', 'n3', 'n4', 'n5']
    >;
    other_conditions_of_applicability: Attribute.Text &
      Attribute.DefaultTo<'n/a'>;
    notes_on_other_conditions_of_applicability: Attribute.Text;
    other_conditions_of_applicability_score: Attribute.Enumeration<
      ['n-5', 'n-4', 'n-3', 'n-2', 'n-1', 'n0', 'n1', 'n2', 'n3', 'n4', 'n5']
    >;
    case_law: Attribute.Text;
    notes_on_case_law: Attribute.Text;
    related_case_law: Attribute.Text & Attribute.DefaultTo<'n/a'>;
    notes_on_related_case_law: Attribute.Text;
    type_of_remuneration: Attribute.Text;
    notes_on_type_of_remuneration: Attribute.Text;
    statutory_reference: Attribute.Text;
    special_characteristics_of_the_scheme: Attribute.Text;
    notes_on_special_characteristics_of_the_scheme: Attribute.Text;
    type: Attribute.Enumeration<['EUsource', 'Provision']>;
    copyright_user_eus: Attribute.Relation<
      'api::copyright-flexibilities.copyright-flexibilities',
      'manyToMany',
      'api::copyright-user-eu.copyright-user-eu'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::copyright-flexibilities.copyright-flexibilities',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::copyright-flexibilities.copyright-flexibilities',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiCopyrightKnowledgeScraperCopyrightKnowledgeScraper
  extends Schema.CollectionType {
  collectionName: 'copyright_knowledge_scrapers';
  info: {
    singularName: 'copyright-knowledge-scraper';
    pluralName: 'copyright-knowledge-scrapers';
    displayName: 'Copyright Knowledge Scrapers Configuration';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    configuration: Attribute.JSON;
    Pattern: Attribute.String;
    active: Attribute.Boolean;
    IntervalInHours: Attribute.Integer;
    DestinationDatabase: Attribute.Enumeration<
      [
        'Copyright Evidence',
        'Copyright Flexibilities',
        'Copyright User EU',
        'Copyright User',
        'Copyright History',
        'General'
      ]
    > &
      Attribute.Required;
    Scrape_Sources: Attribute.Enumeration<
      ['Wikipedia', 'Bielefeld Collection', 'Placeholder Source']
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::copyright-knowledge-scraper.copyright-knowledge-scraper',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::copyright-knowledge-scraper.copyright-knowledge-scraper',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiCopyrightUserEuCopyrightUserEu
  extends Schema.CollectionType {
  collectionName: 'copyright_user_eus';
  info: {
    singularName: 'copyright-user-eu';
    pluralName: 'copyright-user-eus';
    displayName: 'Copyright User EU';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    category: Attribute.Enumeration<
      [
        'PROTECTED WORKS',
        'ECONOMIC RIGHTS',
        'RELATED RIGHTS',
        'MORAL RIGHTS',
        'AUTHORS AND OWNERS',
        'THE PUBLIC DOMAIN',
        'COPYRIGHT DURATION',
        'COPYRIGHT EXCEPTIONS',
        'MANDATORY EXCEPTIONS',
        'OPTIONAL EXCEPTIONS',
        'GETTING PERMISSION',
        'CONTRACTS AND TPMS',
        'ORPHAN WORKS',
        'OUT OF COMMERCE WORKS',
        'GIVING PERMISSION',
        'COLLECTING SOCIETIES',
        'ENFORCEMENT',
        'PRIVATE ENFORCEMENT',
        'ONLINE INTERMEDIARIES',
        'PUBLIC ENFORCEMENT'
      ]
    >;
    content: Attribute.Text;
    excerpt: Attribute.Text;
    u_id: Attribute.UID;
    types: Attribute.Text;
    copyright_flexibilities: Attribute.Relation<
      'api::copyright-user-eu.copyright-user-eu',
      'manyToMany',
      'api::copyright-flexibilities.copyright-flexibilities'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::copyright-user-eu.copyright-user-eu',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::copyright-user-eu.copyright-user-eu',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiDataEmbellishedCopyrightEvidenceDataEmbellishedCopyrightEvidence
  extends Schema.CollectionType {
  collectionName: 'data_embellished_copyright_evidences';
  info: {
    singularName: 'data-embellished-copyright-evidence';
    pluralName: 'data-embellished-copyright-evidences';
    displayName: 'Data_Embellished_Copyright_Evidence';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    paperId: Attribute.String;
    corpusId: Attribute.String;
    url: Attribute.String;
    title: Attribute.String;
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
    CE_Title: Attribute.String;
    CE_Authors: Attribute.String;
    abstract: Attribute.Text;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::data-embellished-copyright-evidence.data-embellished-copyright-evidence',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::data-embellished-copyright-evidence.data-embellished-copyright-evidence',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiSuggestionsCopyrightEvidenceSuggestionsCopyrightEvidence
  extends Schema.CollectionType {
  collectionName: 'suggestions_copyright_evidences';
  info: {
    singularName: 'suggestions-copyright-evidence';
    pluralName: 'suggestions-copyright-evidences';
    displayName: 'Suggestions_Copyright_Evidence';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    approved: Attribute.Boolean;
    paperId: Attribute.String;
    corpusId: Attribute.String;
    url: Attribute.String;
    title: Attribute.Text;
    venue: Attribute.String;
    year: Attribute.Integer;
    citationCount: Attribute.Integer;
    referenceCount: Attribute.Integer;
    influentialCitationCount: Attribute.Integer;
    fieldsOfStudy: Attribute.String;
    publicationDate: Attribute.Date;
    journal: Attribute.JSON;
    citationStyles: Attribute.JSON;
    authors: Attribute.JSON;
    externalIds: Attribute.JSON;
    s2FieldsOfStudy: Attribute.JSON;
    publicationTypes: Attribute.JSON;
    suggestionCount: Attribute.Integer & Attribute.DefaultTo<1>;
    CE_ENTRY_LINK: Attribute.String;
    approvalLog: Attribute.Text;
    openAccessPdf: Attribute.JSON;
    abstract: Attribute.Text;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::suggestions-copyright-evidence.suggestions-copyright-evidence',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::suggestions-copyright-evidence.suggestions-copyright-evidence',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiYouCanPlayYouCanPlay extends Schema.CollectionType {
  collectionName: 'you_can_plays';
  info: {
    singularName: 'you-can-play';
    pluralName: 'you-can-plays';
    displayName: 'You Can Play';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    game_title: Attribute.Text;
    publisher: Attribute.String;
    other: Attribute.Text;
    sources: Attribute.Text;
    fanworks: Attribute.Text;
    game_videos: Attribute.Text;
    passive_ad_revenues: Attribute.Text;
    original_soundtrack: Attribute.Text;
    screenshots: Attribute.Text;
    merchandise: Attribute.Text;
    mods: Attribute.Text;
    commercial_use: Attribute.Text;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::you-can-play.you-can-play',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::you-can-play.you-can-play',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

declare module '@strapi/strapi' {
  export module Shared {
    export interface ContentTypes {
      'admin::permission': AdminPermission;
      'admin::user': AdminUser;
      'admin::role': AdminRole;
      'admin::api-token': AdminApiToken;
      'admin::api-token-permission': AdminApiTokenPermission;
      'admin::transfer-token': AdminTransferToken;
      'admin::transfer-token-permission': AdminTransferTokenPermission;
      'plugin::upload.file': PluginUploadFile;
      'plugin::upload.folder': PluginUploadFolder;
      'plugin::cron.cron-job': PluginCronCronJob;
      'plugin::i18n.locale': PluginI18NLocale;
      'plugin::users-permissions.permission': PluginUsersPermissionsPermission;
      'plugin::users-permissions.role': PluginUsersPermissionsRole;
      'plugin::users-permissions.user': PluginUsersPermissionsUser;
      'plugin::graphs-builder.graph': PluginGraphsBuilderGraph;
      'api::copyright-flexibilities.copyright-flexibilities': ApiCopyrightFlexibilitiesCopyrightFlexibilities;
      'api::copyright-knowledge-scraper.copyright-knowledge-scraper': ApiCopyrightKnowledgeScraperCopyrightKnowledgeScraper;
      'api::copyright-user-eu.copyright-user-eu': ApiCopyrightUserEuCopyrightUserEu;
      'api::data-embellished-copyright-evidence.data-embellished-copyright-evidence': ApiDataEmbellishedCopyrightEvidenceDataEmbellishedCopyrightEvidence;
      'api::suggestions-copyright-evidence.suggestions-copyright-evidence': ApiSuggestionsCopyrightEvidenceSuggestionsCopyrightEvidence;
      'api::you-can-play.you-can-play': ApiYouCanPlayYouCanPlay;
    }
  }
}
