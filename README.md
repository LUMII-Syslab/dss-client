# DSS (Data Shape Server) Client

This project contains a client library for a Data Shape Server 
(https://github.com/LUMII-Syslab/data-shape-server) that provides
some utility classes for querying shape data for ontologies.

This package provides 4 classes: DSSClient, TripletStore, QueryBuilder, DSSAutocompletionClient:
- DSSClient: Provides a thin wrapper for Data Shape Server web API.
- TripletStore: Wraps an array of RDF triples, providing some utility methods.
- QueryBuilder: A typed parameter builder for improving request experience.
- DSSAutocompletionClient: Gathers context from a tripletstore and uses a DSSClient instance to create autocompletion suggestions for variables.
