// Product page GraphQL queries and fragments for NoaBea

export const PRODUCT_DETAILS_QUERY = `#graphql
  fragment MoneyProductItem on MoneyV2 {
    amount
    currencyCode
  }

  fragment ProductVariantDetails on ProductVariant {
    availableForSale
    compareAtPrice {
      ...MoneyProductItem
    }
    id
    image {
      url
      altText
      width
      height
    }
    price {
      ...MoneyProductItem
    }
    product {
      title
      handle
    }
    selectedOptions {
      name
      value
    }
    sku
    title
    unitPrice {
      ...MoneyProductItem
    }
  }

  fragment ProductDetails on Product {
    id
    title
    handle
    vendor
    description
    descriptionHtml
    options {
      name
      optionValues {
        name
      }
    }
    selectedVariant: selectedOrFirstAvailableVariant(selectedOptions: $selectedOptions, ignoreUnknownOptions: true, caseInsensitiveMatch: true) {
      ...ProductVariantDetails
    }
    variants(first: 1) {
      nodes {
        ...ProductVariantDetails
      }
    }
    seo {
      description
      title
    }
    featuredImage {
      id
      url
      altText
      width
      height
    }
    images(first: 10) {
      nodes {
        id
        url
        altText
        width
        height
      }
    }
    metafields(identifiers: [
      {namespace: "custom", key: "size"},
      {namespace: "custom", key: "texture"},
      {namespace: "custom", key: "scent"},
      {namespace: "custom", key: "ingredients"},
      {namespace: "custom", key: "benefits"}
    ]) {
      key
      value
      namespace
    }
  }

  query ProductDetails(
    $country: CountryCode
    $handle: String!
    $language: LanguageCode
    $selectedOptions: [SelectedOptionInput!]!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...ProductDetails
    }
  }
` as const;

export const FEATURED_PRODUCT_QUERY = `#graphql
  fragment FeaturedProductItem on Product {
    id
    title
    handle
    vendor
    description
    featuredImage {
      id
      url
      altText
      width
      height
    }
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    variants(first: 1) {
      nodes {
        id
        availableForSale
        price {
          amount
          currencyCode
        }
      }
    }
    metafields(identifiers: [
      {namespace: "custom", key: "featured"},
      {namespace: "custom", key: "size"},
      {namespace: "custom", key: "ingredients"}
    ]) {
      key
      value
      namespace
    }
  }

  query FeaturedProduct(
    $country: CountryCode
    $language: LanguageCode
    $handle: String!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...FeaturedProductItem
    }
  }
` as const;

export const FIRST_PRODUCT_QUERY = `#graphql
  fragment FirstProductItem on Product {
    id
    title
    handle
    vendor
    description
    featuredImage {
      id
      url
      altText
      width
      height
    }
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    variants(first: 1) {
      nodes {
        id
        availableForSale
        price {
          amount
          currencyCode
        }
      }
    }
  }

  query FirstProduct(
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    products(first: 1, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...FirstProductItem
      }
    }
  }
` as const;
