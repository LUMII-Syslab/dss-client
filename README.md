# DSS (Data Shape Server) Client

This project contains a client library for a Data Shape Server 
(https://github.com/LUMII-Syslab/data-shape-server) that provides
some utility classes for querying shape data for ontologies.

This package provides 4 classes: DSSClient, TripletStore, QueryBuilder, DSSAutocompletionClient:
- DSSClient: Provides a thin wrapper for Data Shape Server web API.
- TripletStore: Wraps an array of RDF triples, providing some utility methods.
- QueryBuilder: A typed parameter builder for improving request experience.
- DSSAutocompletionClient: Gathers context from a tripletstore and uses a DSSClient instance to create autocompletion suggestions for variables.

Example:
```ts
const tripleStore = new TripletStore();
tripleStore.triplets = [
    {subject: "?x", predicate: "rdf:type", object: "dbo:Person"}
];
dssClient.ontology = "my_dss_ontology";
const client = new DSSAutocompletionClient(tripleStore, dssClient);
const properties = await client.suggestOutgoingProperties("?x");
```

In this example `properties` will be a list of resources that are likely to be outgoing properties of the variable.

For use in a text editor, context triplets will need to be extracted from the text editor.
