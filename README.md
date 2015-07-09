![logo](http://45.55.193.224/logo_grey.png) 
#Flux Balance Analysis Application
Backend code for our [FBA-Interface Web App](https://github.com/igemuoftATG/fba-webapp)

##Description

University of Toronto iGEM (international Genetically Engineered Machine) is a student association dedicated to the practice of synthetic biology and dissemination of its scientific foundations. The culmination of each year's efforts is a submission to the iGEM conferences as the University of Toronto team

##API References
  Name | Reference | Version
  -----|-----------|--------
  Python & PIP | https://docs.python.org/3/ | 3.4
  CobraPy | https://cobrapy.readthedocs.org/en/latest/ | 
  Scipy Stack | http://www.scipy.org/install.html | 
  VirtualEnv | https://virtualenv.pypa.io/en/latest/installation.html | 1.9
  LibSBML | http://sbml.org/Software/libSBML | 5.11.4

##Installation
Ubuntu 14.04 or greater is assumed for these installation guides. Python 3.x is assumed for all instances of Python. Python 2.6 or 2.7 is specifically required for Node installation. 

**System Wide:**
```bash
$ sudo apt-get update
$ sudo apt-get install  python3-pip python3-dev libglpk-dev gfortran 
$ sudo pip-3.2 install virtualenv

$ curl https://nodejs.org/dist/v0.12.6/node-v0.12.6.tar.gz | tar node-v0.12.6.tar.gz 
$ cd node-v0.12.6.tar.gz
$ ./configure && make && sudo make install
```

**Setting up an Isolated Python Environment**

From this point on, things should be installed in virtualenv. ```libsml``` is rather tricky
```bash
julian help, I don't know how to get to venv
```

**Sciypy & Numpy Stack:**
```bash
$ sudo apt-get install python-numpy python-scipy python-matplotlib ipython ipython-notebook python-pandas python-sympy python-nose
```

**Cobrapy:**
```bash
$ sudo pip install python-libsbml-experimental
$ sudo pip install cobra
```

**Actual Web App**
```bash
$ git clone https://github.com/igemuoftATG/fba-api
$ cd fba-api
$ npm install
```

##License
MIT License
