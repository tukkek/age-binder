const PARAMETERS=new URL(window.location).searchParams

export var profile=PARAMETERS.has('profile')
export var debug=PARAMETERS.has('debug')
