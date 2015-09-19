

### MongoDB

See the [downloads](https://www.mongodb.org/downloads) or [install
instructions](http://docs.mongodb.org/manual/administration/install-on-linux/).
On OS X there a few things you need to do before starting `mongod`, see [Run
MongoDB](http://docs.mongodb.org/manual/tutorial/install-mongodb-on-os-x/#run-mongodb).
Alternatively, [Run page for
Ubuntu](http://docs.mongodb.org/manual/tutorial/install-mongodb-on-os-x/#run-mongodb).

### Express Server

Same as above, except no bower here, and there may be some annoying Python
dependencies that refuse to build when installed through pip.

```
cd express-server
npm install -g nodemon
npm install
```

There are some scripts you can run to `curl` requests to the localserver (optimize will only work if cobrapy is installed fully):

```
./build-models.sh
curl http://localhost:9001//model/optimize/iJO1366
```

### cobrapy

See [installation instructions](https://github.com/opencobra/cobrapy/blob/master/INSTALL.md).
The optional dependencies required are:

* [libsbml](http://sbml.org/)
* [numpy](http://numpy.org/)
* [scipy](http://scipy.org/)

Whether or not you use [virtualenv](https://virtualenv.pypa.io/en/latest/) is
up to you. I tried to get libsbml working with a virtual environment, however
something with the C bindings not linking properly prevented it from working. As
a global install however, it worked fine. If `(sudo) pip install python-libsbml`
is not working for you (the build fails), you should have better luck building
from source; see [building and installing libsbml](http://sbml.org/Software/libSBML/5.11.4/docs/formatted/cpp-api/libsbml-installation.html).
Once you have the libsbml source, you can run

```
./config --prefix=DIR/lib/python-version/dist-packages/ --with-python --with-python-interpreter=/path/to/python/binary
```

Also, I even had to use

```
--with-libxml=/path/to/old/libxml/version
```

even though my current libxml was multiple versions ahead of that required.
[SWIG](http://www.swig.org/) is required to build bindings between C and Python
for libsbml.

Please note, you will need to point to the correct Python binary (the one with a working cobra install)
in line 37 of `routes/model/optimize/index.js`:

```js
var optimizeScript = cp.spawn('python', args)
```

This will be moved into `config.js` soon.

## Changelog (web-app)

Current: **1.5**

* Renders metabolic network as a set of *nodes* and *links*
* Integration of d3 with custom canvas rendering for improved performance
* Basic dragging of nodes working
* Panning and zooming of canvas working
* (1.1.x) Added deletion and adding, beta and WIP
    * removal of nodes from target/source when trying to create a reaction is now removed from the options menu
    * (1.1.1) Error handling
    * (1.1.2) Significant performance increases
* (1.2.x) Re factored code for an MVC model, significant overhaul changes
* (1.3.x)
    * Added the specie extracellular network and added new specie class that extends node
    * (1.3.1) Fixed reaction visual bug
* (1.4.x) You can now enter a specie from a network
    * (1.4.1) Fixed broken adding/populate options.  Few more modular improvments
    * (1.4.2) Made it more modular when it comes to adding new systems
    * (1.4.3) Added the ability to return to the network
    * (1.4.4) Zooming in and out of the specie/system returns to earlier state
* (1.5.x) Created brand new data structure to implmented a 3D graph structure

## Community Flux Balance Analysis Pipeline

Models have varying names for metabolites, or sometimes none and only the id. Develop a pipeline for creating and maintaining a standardized set of metabolites and reactions to be used across all models. Potentially integrate this with the web application to increase cooperation and standardization.

1. Given a list of `n` species and their respective genome scale metabolic models (following SBML format as either originally an `.xml` or later as a `.json`),
2. Develop a list of all reactions across all species that occur in the extracellular space, or `e`
3. For each species `i` in `n`, loop through every reaction in `e`. If a reaction contains a metabolite that is involved in a reaction from the 'global e reactions', append it into the model of that specie. This should take O(*rxns_e* \* *n*) where *rxns_e* is the maximal number of extracellular reactions in a specie, and *n* is the number of species.
4. Perform FBA individual on each species `i` in `n`, optimizing for biomass production. The time this takes is proportional to the size of the linear problem to be solved. Further time analysis is necessary to accurately provide an upper bound on this process.
5. Using the results of FBA on each species, we have gathered a flux for each reaction in *rxns_e* of that specie. This will be different across the species; set a new upper and lower bound for each of this reactions by taking the average - SD and the average + SD. In this way, for all of the reactions which share extracellular metabolites, after this point, they will have the same lower and upper bounds.
6. Perform FBA on each species again. Optimizing for biomass, as before. Again, more structured time analysis is needed, however this should take similar time to the previous step.
7. Each biomass objective function for each species returns a numeric value. Use z-scoring to standardize these distributions, so that we may compute a 'relative biomass' value for each specie. The sum of all these values must be equal to 1.
8. Construct a single metabolic model representing the entire community. Each species will be assigned a 'compartment'. The upper and lower bounds of each reaction in each specie will be modified as per that specie's relative biomass. In this way, reactions belonging to a less important specie will have less effect (or more) on the optimization of the objective function, which will be biomass. The results of this cFBA analysis should coincide (to a degree) with experimentally observed community dynamics.

## License
MIT License
=======
