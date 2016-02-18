![logo](http://45.55.193.224:1234/logo_grey.png)

# ConsortiaFlux

ConsortiaFlux is a web app for

* visualizing
* modifying
* analyzing

**genome scale metabolic models of microbial consortia**.

ConsortiaFlux is powered by an [Express](http://expressjs.com/) server which
communicates with a [MongoDB](https://www.mongodb.org/) database and runs Python
scripts using [cobrapy](https://github.com/opencobra/cobrapy) (COnstraints Based
Reconstruction and Analysis). The web app is a single page application built off
of [AngularJS](https://angularjs.org/).

## Usage

See the user guide (coming soon).

## Installation

The web-app and server each depend on [NodeJS](https://nodejs.org/en/) and
[npm](https://www.npmjs.com/).

### Node.js

If you are on OS X or Linux system, I recommend installing using [one of these
methods](https://gist.github.com/isaacs/579814) to avoid having to `sudo`.
Furthermore [see
here](https://github.com/sindresorhus/guides/blob/master/npm-global-without-sudo.md)
to set up npm packages to install into a custom global directory without sudo.
You can check if the install worked by running

```
node -v
```

in a terminal; it should return the version number. You don't need to worry
about sudo on Windows, as Windows runs as admin by default. However, you may
face some `PATH` issues on Windows (see below).

### npm

[npm](https://www.npmjs.com/) is *node package manager* and is the "largest
ecosystem of open source libraries in the world". Node comes with npm, though it
is usually not the latest version, and more importantly, it is not located where
your global npm modules are installed. Before continuing, you should make sure
your `PATH` variable catches the correct npm binary, or in simpler terms,
running

```
npm -v
npm install -g npm
npm -v
```

should return a different value on the second `npm -v`. (You may need to open
and close the terminal first). If it is not, compare the path returned by `npm
install -g npm` (of the format `path -> path2`) to `which npm`. If they are
different, it is because the directory containing Node's npm is earlier in your
`PATH` than the one containing the binaries of npm's global modules. For
example, I have the following in my `.bashrc`:

```
# Node and NPM
export NPM_PACKAGES="$HOME/node/npm-packages"
export NODE_PATH="$NPM_PACKAGES/lib/node_modules:$NODE_PATH"
export PATH="$PATH:$NPM_PACKAGES/bin:$HOME/node/bin"
export MANPATH="$NPM_PACKAGES/share/man:$MANPATH"
```

You can see `PATH` is the original PATH, followed by npm-packages, followed by
node. On OS X and Linux, you can add the above to your `.bashrc` or `.profile`,
etc. to achieve the same effect. To see your environment's `PATH`, run `echo
$PATH`. Note, I used the two methods mentioned above for not using sudo with
Node and npm, with custom folder names (`node`, and `npm-packages`). On Windows,
you can go to System -> Advanced Settings -> Environment Variables -> Path and
edit it there.

### Web app

Once Node and npm are all properly set up, installation and local hosting of the
web app should be a breeze. First, lets install [bower](http://bower.io/) and
[gulp](http://gulpjs.com/) as global npm modules:

```bash
npm install -g bower gulp
```

Once we have those, `cd` into the `web-app` folder and run

```
bower install
npm install
```

These commands will read through the `bower.json` and `package.json` and install
dependencies into `bower_components` and `node_modules`, respectably. When you
are ready to view the application, simply run

```
gulp
```

and your browser will open to `http://localhost:3000`. At this point, any source
modifications will immediately trigger a page refresh.

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
