import adobeXd from '../../assets/svg/skills/adobe-xd.svg';
import afterEffects from '../../assets/svg/skills/after-effects.svg';
import angular from '../../assets/svg/skills/angular.svg';
import aws from '../../assets/svg/skills/aws.svg';
import azure from '../../assets/svg/skills/azure.svg';
import blender from '../../assets/svg/skills/blender.svg';
import bootstrap from '../../assets/svg/skills/bootstrap.svg';
import bulma from '../../assets/svg/skills/bulma.svg';
import c from '../../assets/svg/skills/c.svg';
import capacitorjs from '../../assets/svg/skills/capacitorjs.svg';
import coffeescript from '../../assets/svg/skills/coffeescript.svg';
import css from '../../assets/svg/skills/css.svg';
import dart from '../../assets/svg/skills/dart.svg';
import fastify from '../../assets/svg/skills/fastify.svg';
import figma from '../../assets/svg/skills/figma.svg';
import firebase from '../../assets/svg/skills/firebase.svg';
import flutter from '../../assets/svg/skills/flutter.svg';
import gcp from '../../assets/svg/skills/gcp.svg';
import gimp from '../../assets/svg/skills/gimp.svg';
import git from '../../assets/svg/skills/git.svg';
import java from '../../assets/svg/skills/java.svg';
import javascript from '../../assets/svg/skills/javascript.svg';
import julia from '../../assets/svg/skills/julia.svg';
import kotlin from '../../assets/svg/skills/kotlin.svg';
import lightroom from '../../assets/svg/skills/lightroom.svg';
import markdown from '../../assets/svg/skills/markdown.svg';
import materialui from '../../assets/svg/skills/materialui.svg';
import matlab from '../../assets/svg/skills/matlab.svg';
import memsql from '../../assets/svg/skills/memsql.svg';
import microsoftoffice from '../../assets/svg/skills/microsoftoffice.svg';
import mongodb from '../../assets/svg/skills/mongoDB.svg';
import nextJS from '../../assets/svg/skills/nextJS.svg';
import nuxtJS from '../../assets/svg/skills/nuxtJS.svg';
import opencv from '../../assets/svg/skills/opencv.svg';
import photoshop from '../../assets/svg/skills/photoshop.svg';
import php from '../../assets/svg/skills/php.svg';
import python from '../../assets/svg/skills/python.svg';
import react from '../../assets/svg/skills/react.svg';
import ruby from '../../assets/svg/skills/ruby.svg';
import strapi from '../../assets/svg/skills/strapi.svg';
import svelte from '../../assets/svg/skills/svelte.svg';
import tailwind from '../../assets/svg/skills/tailwind.svg';
import tensorflow from '../../assets/svg/skills/tensorflow.svg';
import typescript from '../../assets/svg/skills/typescript.svg';
import unity from '../../assets/svg/skills/unity.svg';
import vitejs from '../../assets/svg/skills/vitejs.svg';
import vue from '../../assets/svg/skills/vue.svg';
import vuetifyjs from '../../assets/svg/skills/vuetifyjs.svg';
import wolframalpha from '../../assets/svg/skills/wolframalpha.svg';

export type Skill =
  | 'adobe-xd'
  | 'after-effects'
  | 'angular'
  | 'aws'
  | 'azure'
  | 'blender'
  | 'bootstrap'
  | 'bulma'
  | 'c'
  | 'capacitorjs'
  | 'coffeescript'
  | 'css'
  | 'dart'
  | 'fastify'
  | 'figma'
  | 'firebase'
  | 'flutter'
  | 'gcp'
  | 'gimp'
  | 'git'
  | 'java'
  | 'javascript'
  | 'julia'
  | 'kotlin'
  | 'lightroom'
  | 'markdown'
  | 'materialui'
  | 'matlab'
  | 'memsql'
  | 'microsoftoffice'
  | 'mongodb'
  | 'nextjs'
  | 'nuxtjs'
  | 'opencv'
  | 'photoshop'
  | 'php'
  | 'python'
  | 'react'
  | 'ruby'
  | 'strapi'
  | 'svelte'
  | 'tailwind'
  | 'tensorflow'
  | 'typescript'
  | 'unity'
  | 'vitejs'
  | 'vue'
  | 'vuetifyjs'
  | 'wolframalpha';

// src/utils/helpers/skill-image.ts
export const skillsImage = (skill: string): string => {
  const skillID = skill.toLowerCase();
  switch (skillID) {
    case 'adobe xd':
      return `/assets/svg/skills/adobe-xd.svg`;
    case 'adobe audition':
      return `/assets/svg/skills/adobeaudition.svg`;
    case 'after effects':
      return `/assets/svg/skills/after-effects.svg`;
    case 'angular':
      return `/assets/svg/skills/${skillID}.svg`;
    case 'aws':
      return `/assets/svg/skills/${skillID}.svg`;
    case 'azure':
      return `/assets/svg/skills/${skillID}.svg`;
    case 'blender':
      return `/assets/svg/skills/${skillID}.svg`;
    case 'bootstrap':
      return `/assets/svg/skills/${skillID}.svg`;
    case 'bulma':
      return `/assets/svg/skills/${skillID}.svg`;
    case 'c':
      return `/assets/svg/skills/${skillID}.svg`;
    case 'canva':
      return `/assets/svg/skills/${skillID}.svg`;
    case 'capacitorjs':
      return `/assets/svg/skills/${skillID}.svg`;
    case 'coffeescript':
      return `/assets/svg/skills/${skillID}.svg`;
    case 'cplusplus':
      return `/assets/svg/skills/${skillID}.svg`;
    case 'csharp':
      return `/assets/svg/skills/${skillID}.svg`;
    case 'css':
      return `/assets/svg/skills/${skillID}.svg`;
    case 'dart':
      return `/assets/svg/skills/${skillID}.svg`;
    case 'deno':
      return `/assets/svg/skills/${skillID}.svg`;
    case 'django':
      return `/assets/svg/skills/${skillID}.svg`;
    case 'docker':
      return `/assets/svg/skills/${skillID}.svg`;
    case 'fastify':
      return `/assets/svg/skills/${skillID}.svg`;
    case 'figma':
      return `/assets/svg/skills/${skillID}.svg`;
    case 'firebase':
      return `/assets/svg/skills/${skillID}.svg`;
    case 'flutter':
      return `/assets/svg/skills/${skillID}.svg`;
    case 'gcp':
      return `/assets/svg/skills/${skillID}.svg`;
    case 'gimp':
      return `/assets/svg/skills/${skillID}.svg`;
    case 'git':
      return `/assets/svg/skills/${skillID}.svg`;
    case 'go':
      return `/assets/svg/skills/${skillID}.svg`;
    case 'graphql':
      return `/assets/svg/skills/${skillID}.svg`;
    case 'haxe':
      return `/assets/svg/skills/${skillID}.svg`;
    case 'html':
      return `/assets/svg/skills/${skillID}.svg`;
    case 'illustrator':
      return `/assets/svg/skills/${skillID}.svg`;
    case 'ionic':
      return `/assets/svg/skills/${skillID}.svg`;
    case 'java':
      return `/assets/svg/skills/${skillID}.svg`;
    case 'javascript':
      return `/assets/svg/skills/${skillID}.svg`;
    case 'julia':
      return `/assets/svg/skills/${skillID}.svg`;
    case 'kotlin':
      return `/assets/svg/skills/${skillID}.svg`;
    case 'lightroom':
      return `/assets/svg/skills/${skillID}.svg`;
    case 'markdown':
      return `/assets/svg/skills/${skillID}.svg`;
    case 'materialui':
      return `/assets/svg/skills/${skillID}.svg`;
    case 'matlab':
      return `/assets/svg/skills/${skillID}.svg`;
    case 'memsql':
      return `/assets/svg/skills/${skillID}.svg`;
    case 'microsoftoffice':
      return `/assets/svg/skills/${skillID}.svg`;
    case 'mongodb':
      return `/assets/svg/skills/${skillID}.svg`;
    case 'mysql':
      return `/assets/svg/skills/${skillID}.svg`;
    case 'nextjs':
      return `/assets/svg/skills/nextJS.svg`;
    case 'nginx':
      return `/assets/svg/skills/${skillID}.svg`;
    case 'numpy':
      return `/assets/svg/skills/${skillID}.svg`;
    case 'nuxtjs':
      return `/assets/svg/skills/nuxtJS.svg`;
    case 'opencv':
      return `/assets/svg/skills/${skillID}.svg`;
    case 'photoshop':
      return `/assets/svg/skills/${skillID}.svg`;
    case 'php':
      return `/assets/svg/skills/${skillID}.svg`;
    case 'picsart':
      return `/assets/svg/skills/${skillID}.svg`;
    case 'postgresql':
      return `/assets/svg/skills/${skillID}.svg`;
    case 'premierepro':
      return `/assets/svg/skills/${skillID}.svg`;
    case 'python':
      return `/assets/svg/skills/${skillID}.svg`;
    case 'pytorch':
      return `/assets/svg/skills/${skillID}.svg`;
    case 'react':
      return `/assets/svg/skills/${skillID}.svg`;
    case 'ruby':
      return `/assets/svg/skills/${skillID}.svg`;
    case 'selenium':
      return `/assets/svg/skills/${skillID}.svg`;
    case 'sketch':
      return `/assets/svg/skills/${skillID}.svg`;
    case 'strapi':
      return `/assets/svg/skills/${skillID}.svg`;
    case 'svelte':
      return `/assets/svg/skills/${skillID}.svg`;
    case 'swift':
      return `/assets/svg/skills/${skillID}.svg`;
    case 'tailwind':
      return `/assets/svg/skills/${skillID}.svg`;
    case 'tensorflow':
      return `/assets/svg/skills/${skillID}.svg`;
    case 'typescript':
      return `/assets/svg/skills/${skillID}.svg`;
    case 'unity':
      return `/assets/svg/skills/${skillID}.svg`;
    case 'vitejs':
      return `/assets/svg/skills/${skillID}.svg`;
    case 'vue':
      return `/assets/svg/skills/${skillID}.svg`;
    case 'vuetifyjs':
      return `/assets/svg/skills/${skillID}.svg`;
    case 'wolframalpha':
      return `/assets/svg/skills/${skillID}.svg`;
    default:
      return '';
  }
};

export default skillsImage;